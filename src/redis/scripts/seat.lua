-- seat.lua
-- 단일 Lua 스크립트 내에서 command 기반으로 기능 분기

local command = ARGV[1]

--------------------------------------------------
-- 1) 전체 좌석 조회
--------------------------------------------------
if command == "getAllSeats" then
    return redis.call("HGETALL", KEYS[1])
end

--------------------------------------------------
-- 2) 좌석 초기화 (lock 제외)
--------------------------------------------------
if command == "resetSeats" then
    local seats = redis.call("HGETALL", KEYS[1])
    for i = 1, #seats, 2 do
        local seatId = seats[i]
        local status = seats[i + 1]

        if status ~= "lock" then
            redis.call("HSET", KEYS[1], seatId, "available")
        end
    end
    return "OK"
end

--------------------------------------------------
-- 3) 좌석 초기 데이터 생성
-- ARGV[2] = seatCount
--------------------------------------------------
if command == "seedSeats" then
    local rows = tonumber(ARGV[2])   -- row count (A,B,C...)
    local cols = tonumber(ARGV[3])   -- seat count per row

    for r = 1, rows do
        local rowLetter = string.char(64 + r)  -- 1→A, 2→B, 3→C ...
        for c = 1, cols do
            local id = rowLetter .. c
            redis.call("HSET", KEYS[1], id, "available")
        end
    end

    return "OK"
end


--------------------------------------------------
-- 4) 좌석 락(lock)
-- ARGV[2] = seatId
--------------------------------------------------
if command == "lockSeat" then
    local seatId = ARGV[2]

    local status = redis.call("HGET", KEYS[1], seatId)

    if status ~= "available" then
        return 0
    end

    redis.call("HSET", KEYS[1], seatId, "lock")

    return 1
end

--------------------------------------------------
-- 5) 단일 좌석 상태 조회
-- ARGV[2] = seatId
--------------------------------------------------
if command == "getSingleSeat" then
    local seatId = ARGV[2]
    local status = redis.call("HGET", KEYS[1], seatId)
    return status -- 존재하지 않으면 nil 반환
end

--------------------------------------------------
-- 6) 좌석 락 해제(available)
-- ARGV[2] = seatId
-- ARGV[3] = userId
-- ARGV[4] = ttlSeconds
--------------------------------------------------
if command == "ableSeat" then
    local seatId = ARGV[2]

    local status = redis.call("HGET", KEYS[1], seatId)

    if status ~= "lock" then
        return 0
    end

    redis.call("HSET", KEYS[1], seatId, "available")

    return 1
end

return "UNKNOWN_COMMAND"
