import json
import os.path
import sys


def time_to_seconds(time_str):
    def to_seconds(time_str):
        hours, minutes, seconds_milliseconds = time_str.split(':')
        seconds, milliseconds = seconds_milliseconds.split(',')
        total_seconds = (
                int(hours) * 3600 +
                int(minutes) * 60 +
                int(seconds) +
                int(milliseconds) / 1000
        )

        return total_seconds

    from_, to_ = time_str.split(' --> ')
    return to_seconds(from_), to_seconds(to_)


def srt_to_json(srt_path):
    with open(srt_path, 'r') as f:
        srt_text = f.read()
        srt_pieces = srt_text.split('\n\n')

    dir_path = os.path.dirname(srt_path)
    file_name = os.path.basename(srt_path)

    ret = []
    for srt_piece in srt_pieces:
        lines = srt_piece.split('\n')
        if len(lines) < 4:
            continue

        idx = lines[0]
        time_str = lines[1]
        trans = lines[2]
        text = lines[3]

        from_secs, to_secs = time_to_seconds(time_str)

        # print(idx, from_secs, to_secs, trans, text)
        ret.append({
            "id": idx,
            "text": text,
            "translation": trans,
            "start": from_secs,
            "end": to_secs,
        })
        print(text)


    new_path = os.path.join(dir_path, file_name.replace('.srt', '.json'))
    with open(new_path, 'w') as f:
        json.dump(ret, f)


if __name__ == '__main__':
    # srt_path = sys.argv[1]

    srt_path = 'spirited_away_jp_cn.srt'
    srt_to_json(srt_path)
