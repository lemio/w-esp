local band = bit.band
local bxor = bit.bxor
local bor = bit.bor
local tremove = table.remove
local srep = string.rep
local ssub = string.sub
local sbyte = string.byte
local schar = string.char
local tinsert = table.insert
local tconcat = table.concat
local mmin = math.min
local strpack = struct.pack
local strunpack = struct.unpack
local mfloor = math.floor
local mrandom = math.random
local unpack = unpack or table.unpack

encode = function(data,opcode,masked,fin)
  local encoded
  local header = opcode or 1-- TEXT is default opcode
  if fin == nil or fin == true then
    header = bor(header,bit_7)
  end
  local payload = 0
  if masked then
    payload = bor(payload,bit_7)
  end
  local len = #data
  if len < 126 then
    payload = bor(payload,len)
    encoded = strpack('bb',header,payload)
  elseif len <= 0xffff then
    payload = bor(payload,126)
    encoded = strpack('bb>H',header,payload,len)
  elseif len < 2^53 then
    local high = mfloor(len/2^32)
    local low = len - high*2^32
    payload = bor(payload,127)
    encoded = strpack('bb>I>I',header,payload,high,low)
  end
  if not masked then
    encoded = encoded..data
  else
    local m1 = mrandom(0,0xff)
    local m2 = mrandom(0,0xff)
    local m3 = mrandom(0,0xff)
    local m4 = mrandom(0,0xff)
    local mask = {m1,m2,m3,m4}
    encoded = tconcat({
        encoded,
        strpack('BBBB',m1,m2,m3,m4),
        xor_mask(data,mask,#data)
    })
  end
  return encoded
end
