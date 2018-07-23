import logging
import urllib2
import webapp2

'''
# Giphy API for demo/testing purposes

api_key_giphy = "[YOUR GIPHY API KEY]"
with open('api_keys/giphy.txt','r') as f:
    api_key_giphy = f.read()


giphy_url = ('http://api.giphy.com/v1/gifs/search?api_key={}&q=hello&limit=1'
    .format(api_key_giphy))
'''

def call_rest_api():
    # HIGHLY recommend storing API keys in separate file
    # Add the key file to .gitignore (so not in GitHub)
    api_key_maps = "[YOUR MAPS API KEY]"
    
    # Read the API key in the separate files
    with open('api_keys/maps.txt','r') as f:
        api_key_maps = f.read()

    print(api_key_maps)
    maps_url = ("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key={}"
        .format(api_key_maps))
    try:
        result = urllib2.urlopen(maps_url)
        return result.read()
    except urllib2.URLError:
        logging.exception('Caught exception fetching url')


class MainPage(webapp2.RequestHandler):
    def get(self):
        response = call_rest_api()
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(response)

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)