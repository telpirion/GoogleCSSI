import webapp2

#the handler section
class MainPage(webapp2.RequestHandler):
    def get(self): #for a GET request
        self.response.write('Hello, World!') #the response

#the app configuration section
app = webapp2.WSGIApplication([
    ('/', MainPage), #this maps the root url to the MainPage Handler
], debug=True)