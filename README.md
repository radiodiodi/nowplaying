# Now Playing Server

Reads track info from file and serves it over websockets.

## Configuration

create `.env` file to and define following variables:
- FILEPATH, path to input file
- HOST, websocket host address
- PORT, port for incoming websocket connections

## Input

The program watches changes in specified JSON file. It tries to parse 
JSON object with following fields:`title` (srt), `artist` (srt) and 
`durationMs` (int).

example input file:
```
{
    "title": "The Free Software Song",
    "artist": "Richard Stallman",
    "durationMs": 120000
}
```

## Output

Output is trough web sockets and consist of a JSON object with following
fields: `title` (str), `artist` (str) and unix timestamp `end` (str, 
milliseconds).

`title` and `artist` are escaped for html. New output may be sent before 
`end` is reached and it should be treated as the time when "now playing"
should be cleared.

All fields might be `null` if data is missing.





