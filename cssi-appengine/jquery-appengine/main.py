import jinja2
import logging
import os
import webapp2

'''
Simple example that gets a HTML template (Jinja2)
that uses jQuery
'''

jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainPage(webapp2.RequestHandler):
    def get(self):
        welcome_template = jinja_env.get_template('templates/welcome.html')
        self.response.write(welcome_template.render())

class MaterialPage(webapp2.RequestHandler):
    def get(self):
        material_template = jinja_env.get_template('templates/material.html')
        self.response.write(material_template.render())

class SPAPage(webapp2.RequestHandler):
    def get(self):
        spa_template = jinja_env.get_template('templates/spa.html')
        self.response.write(spa_template.render())

class ButtonTogglePage(webapp2.RequestHandler):
    def get(self):
        render_vars = {
            "button_1": "hide",
            "button_2": "show"
        }
        button_template = jinja_env.get_template('templates/button-toggle.html')
        self.response.write(button_template .render(render_vars))

class AudioPage(webapp2.RequestHandler):
    def get(self):
        audio_template = jinja_env.get_template('templates/audio.html')
        self.response.write(audio_template.render())

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/material', MaterialPage),
    ('/spa', SPAPage),
    ('/button-toggle', ButtonTogglePage),
    ('/audio', AudioPage),
], debug=True)