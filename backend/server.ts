import type {Session} from './models/Session_Interface'
import type {Activity_Log} from './models/ActivityLog_Interface'
import type {Request, Response} from 'express'
import process = require('node:process')

const express=require('express')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())
const port = 3000;

const sessions:Record<number,Session>={}
const activityLogs:Record<number,Activity_Log[]>={}


app.post('/session/start',(req:Request,res:Response)=>{
    const {allowedDomains,duration}=req.body
    const sessionId=Date.now()
    
    const newSession:Session={
        sessionId,
        startTime: Date.now(),
        endTime:0,
        status:"active",
        allowedDomains,
        duration
    }
    sessions[sessionId]=newSession
    activityLogs[sessionId]=[]
    res.json({newSession})
})

app.post('/session/track',(req:Request,res:Response)=>{
    const {sessionId,domain,startTime,endTime} = req.body
    const session=sessions[sessionId]
    if(session!==undefined){
     if(session.status=="active"){
        const allowedDomains=session.allowedDomains
        const newactivity_log:Activity_Log={
            sessionId,
            domain,
            isProductive:allowedDomains.includes(domain),
            startTime,
            endTime
        }
        if(activityLogs[sessionId]!==undefined){
            activityLogs[sessionId].push(newactivity_log)
        }
        else{
            activityLogs[sessionId]=[]
            activityLogs[sessionId].push(newactivity_log)
        }
        
        res.json({"message":"Activity logged"})
     }
     else{
        res.json({"message":"Session is not active"})
     }
    }
    else{
        res.json({"message":"Session not found"})
    }
})

app.post('/session/end',(req:Request,res:Response)=>{
    const {sessionId}=req.body
    const current_time= Date.now()
    const session=sessions[sessionId]
    if(session!==undefined){
        if(session.status!=="ended"){
            session.endTime=current_time
            session.status="ended"
            res.json({
                "message":"Session ended",
                sessionId
            })
        }
        else{
            res.json({"message":"Session already ended"})
        }
    }
    else{
        res.json({"message":"Session not found"})
    }
})

app.get('/session/:id/analytics', (req: Request, res: Response) => {
    const sessionId=Number(req.params.id)
    const session=sessions[sessionId]

    if (!session) {
        return res.json({ message: "Session not found" })
    }
    if(session.status!=="ended" && session){
        return res.json({message:"Session did not end"})
    }

    const logs=activityLogs[sessionId] || []

    let productiveTime=0
    let unproductiveTime=0
    let unproductivedomainsVisited: string[]=[]
    let totalunproductiveJumps=0
    let lastProductive=true
    let totalunproductiveVisits=0

    logs.forEach((a) => {
        const duration=a.endTime-a.startTime
        

        if (a.isProductive) {
            lastProductive=true
            productiveTime+=duration
        } else {
            if(lastProductive){
                totalunproductiveJumps+=1
            }
            lastProductive=false
            
            unproductiveTime+= duration
            totalunproductiveVisits+=1
            if(!unproductivedomainsVisited.includes(a.domain)){
                unproductivedomainsVisited.push(a.domain)
            }
            else{
                console.log(`${a.domain} already in unprod list`)
            }
            
        }
    })

    const actualsessionDuration=productiveTime+unproductiveTime

    res.json({
        productiveTime,
        unproductiveTime,
        sessionDuration:session.duration,
        actualsessionDuration,
        unproductivedomainsVisited,
        totalunproductiveJumps,
        totalunproductiveVisits
    })
})


/* For testing */
if (require.main === module) {
    app.listen(port, function () {
        console.log("Server is running at http://127.0.0.1:" + port);
    });
}

module.exports = app;



