"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());
var port = 3000;
var sessions = {};
var activityLogs = {};
app.post('/session/start', function (req, res) {
    var _a = req.body, allowedDomains = _a.allowedDomains, duration = _a.duration;
    var sessionId = Date.now();
    var newSession = {
        sessionId: sessionId,
        startTime: Date.now(),
        endTime: 0,
        status: "active",
        allowedDomains: allowedDomains,
        duration: duration
    };
    sessions[sessionId] = newSession;
    activityLogs[sessionId] = [];
    res.json({ newSession: newSession });
});
app.post('/session/track', function (req, res) {
    var _a = req.body, sessionId = _a.sessionId, domain = _a.domain, startTime = _a.startTime, endTime = _a.endTime;
    var session = sessions[sessionId];
    if (session !== undefined) {
        if (session.status == "active") {
            var allowedDomains = session.allowedDomains;
            var newactivity_log = {
                sessionId: sessionId,
                domain: domain,
                isProductive: allowedDomains.includes(domain),
                startTime: startTime,
                endTime: endTime
            };
            if (activityLogs[sessionId] !== undefined) {
                activityLogs[sessionId].push(newactivity_log);
            }
            else {
                activityLogs[sessionId] = [];
                activityLogs[sessionId].push(newactivity_log);
            }
            res.json({ "message": "Activity logged" });
        }
        else {
            res.json({ "message": "Session is not active" });
        }
    }
    else {
        res.json({ "message": "Session not found" });
    }
});
app.post('/session/end', function (req, res) {
    var sessionId = req.body.sessionId;
    var current_time = Date.now();
    var session = sessions[sessionId];
    if (session !== undefined) {
        if (session.status !== "ended") {
            session.endTime = current_time;
            session.status = "ended";
            res.json({
                "message": "Session ended",
                sessionId: sessionId
            });
        }
        else {
            res.json({ "message": "Session already ended" });
        }
    }
    else {
        res.json({ "message": "Session not found" });
    }
});
app.get('/session/:id/analytics', function (req, res) {
    var sessionId = Number(req.params.id);
    var session = sessions[sessionId];
    if (!session) {
        return res.json({ message: "Session not found" });
    }
    if (session.status !== "ended" && session) {
        return res.json({ message: "Session did not end" });
    }
    var logs = activityLogs[sessionId] || [];
    var productiveTime = 0;
    var unproductiveTime = 0;
    var unproductivedomainsVisited = [];
    var totalunproductiveJumps = 0;
    var lastProductive = true;
    var totalunproductiveVisits = 0;
    logs.forEach(function (a) {
        var duration = a.endTime - a.startTime;
        if (a.isProductive) {
            lastProductive = true;
            productiveTime += duration;
        }
        else {
            if (lastProductive) {
                totalunproductiveJumps += 1;
            }
            lastProductive = false;
            unproductiveTime += duration;
            totalunproductiveVisits += 1;
            if (!unproductivedomainsVisited.includes(a.domain)) {
                unproductivedomainsVisited.push(a.domain);
            }
            else {
                console.log("".concat(a.domain, " already in unprod list"));
            }
        }
    });
    var actualsessionDuration = productiveTime + unproductiveTime;
    res.json({
        productiveTime: productiveTime,
        unproductiveTime: unproductiveTime,
        sessionDuration: session.duration,
        actualsessionDuration: actualsessionDuration,
        unproductivedomainsVisited: unproductivedomainsVisited,
        totalunproductiveJumps: totalunproductiveJumps,
        totalunproductiveVisits: totalunproductiveVisits
    });
});

if (require.main === module) {
    app.listen(port, function () {
        console.log("Server is running at http://127.0.0.1:" + port);
    });
}

module.exports = app;
