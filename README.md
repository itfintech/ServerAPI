# ServerAPI
The host and port on which ServerAPI will run and allowed hosts are configurable in config.json.
For allowed hosts, "*" - means it allows all, or you can specify exact hosts
Ping endpoint has structure: /api/ping/your.ip.add.ress
There is also the possibility to choose number of echo requests to send (default is 3).
Example: as query params you can specify this parameter: /api/ping/127.0.0.1?n=10, it cannot be less than or equal to zero.
There is validation on IP, based on regex

The answer to this endpoint looks like this:
Pinging 127.0.0.1 with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128

Ping statistics for 127.0.0.1:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms