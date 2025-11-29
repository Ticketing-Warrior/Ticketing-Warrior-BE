-- queue.lua
-- ARGV[1] = command

local command = ARGV[1]

--------------------------------------------------
-- 1) 대기열 전체 조회
--------------------------------------------------
if command == "getQueue" then
    return redis.call("LRANGE", KEYS[1], 0, -1)
end

--------------------------------------------------
-- 2) 대기열 추가 (중복 방지)
-- ARGV[2] = nickname
--------------------------------------------------
if command == "addToQueue" then
    local nickname = ARGV[2]

    local pos = redis.call("LPOS", KEYS[1], nickname)
    if pos == false then
        redis.call("RPUSH", KEYS[1], nickname)
    end

    return redis.call("LPOS", KEYS[1], nickname)
end

--------------------------------------------------
-- 3) 대기열 제거
-- ARGV[2] = nickname
--------------------------------------------------
if command == "removeFromQueue" then
    local nickname = ARGV[2]
    return redis.call("LREM", KEYS[1], 0, nickname)
end

--------------------------------------------------
-- 4) 내 순번 조회
-- ARGV[2] = nickname
--------------------------------------------------
if command == "getMyPosition" then
    local nickname = ARGV[2]
    local pos = redis.call("LPOS", KEYS[1], nickname)

    if pos == false then
        return -1
    end

    return pos
end

--------------------------------------------------
-- 5) 대기열 초기화
--------------------------------------------------
if command == "clearQueue" then
    return redis.call("DEL", KEYS[1])
end

--------------------------------------------------
-- 6) 사이클 시작 시간 설정 (초기화 시간)
--------------------------------------------------
if command == "setCycleStartTime" then
    return redis.call("SET", "cycle:start:time", ARGV[2])
end

--------------------------------------------------
-- 7) 사이클 시작 시간 조회 (초기화 시간)
--------------------------------------------------
if command == "getCycleStartTime" then
    return redis.call("GET", "cycle:start:time")
end

return "UNKNOWN_COMMAND"