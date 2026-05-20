import requests
import urllib3


urllib3.disable_warnings(
    urllib3.exceptions.InsecureRequestWarning
)


DEFAULT_HEADERS = {

    "User-Agent": (

        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"

    )

}


def safe_get(
    url,
    timeout=5,
    allow_redirects=True
):

    try:

        response = requests.get(

            url,

            timeout=timeout,

            allow_redirects=allow_redirects,

            verify=False,

            headers=DEFAULT_HEADERS

        )

        return response

    except requests.exceptions.RequestException:

        return None