import re
import urllib.request
import base64
import os

# define a function to encode a file as base64
def encode_file_as_base64(filename):
    print("processing: ", filename)
    url_base = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/fonts/"
    url = url_base + filename

    if not os.path.isfile("tmp/" + filename):
        urllib.request.urlretrieve(url, "tmp/" + filename)

    with open("tmp/" + filename, 'rb') as f:
        return base64.b64encode(f.read()).decode("utf-8")

# read the CSS file into a string
with open('katex.min.css', 'r') as f:
    css_string = f.read()

# define the regular expression pattern
pattern = r'url\((.*?)\) format\((.*?)\)'

# define a function to replace the matched pattern with the base64-encoded data URI
def replace_match(match):
    url = match.group(1)
    filename = url[6:]

    format = match.group(2)
    base64_code = encode_file_as_base64(filename)
    return f'url(data:application/{filename};charset=utf-8;base64,{base64_code}) format({format})'

new_css_string = re.sub(pattern, replace_match, css_string)
with open('new_styles.css', 'w') as f:
    f.write(new_css_string)