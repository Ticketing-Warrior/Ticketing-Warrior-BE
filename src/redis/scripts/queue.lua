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
-- 5) 세션 시작 시간 기록
-- ARGV[2] = nickname
--------------------------------------------------
if command == "setSessionStart" then
    local nickname = ARGV[2]
    
    return redis.call("SET", "session:start:" .. nickname, ARGV[3])
end

--------------------------------------------------
-- 6) 세션 조회
-- ARGV[2] = nickname
--------------------------------------------------
if command == "getSessionStart" then
    local nickname = ARGV[2]
    return redis.call("GET", "session:start:" .. nickname)
end

--------------------------------------------------
-- 7) 세션 삭제
-- ARGV[2] = nickname
--------------------------------------------------
if command == "clearSessionStart" then
    local nickname = ARGV[2]
    return redis.call("DEL", "session:start:" .. nickname)
end

return "UNKNOWN_COMMAND"