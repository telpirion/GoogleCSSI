#!/usr/bin/python
#
# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import webapp2
import os
import jinja2
from hogwarts_models import Student, Wand, House, Course, Enrollment, Teacher
from seed_hogwarts_db import seed_data

jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write("Welcome to Hogwarts' Online Portal")

class HouseHandler(webapp2.RequestHandler):
    def get(self):
        hogwarts_houses = House.query().order(House.name).fetch()
        start_template = jinja_env.get_template("templates/houselist.html")
        self.response.write(start_template.render({'house_info' : hogwarts_houses}))

class WandsHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Wands!')
        wands_query = Wand.query().fetch()

        wand_template = jinja_env.get_template('templates/wandlist.html')
        self.response.write(wand_template.render({ 'wands': wands_query}))

    def post(self):
        core = self.request.get('core')
        material = self.request.get('material')
        length = self.request.get('length')

        first_name = self.request.get('owner_first_name')
        last_name = self.request.get('owner_last_name')

        student_results = Student.query().filter(Student.first_name == first_name
            and Student.last_name == last_name).fetch()

        if len(student_results) > 0:
            student = student_results[0]
            new_wand = Wand(core=core, material=material, length=float(length), owner=student.key).put()
        else:
            new_wand = Wand(core=core, material=material, length=float(length), owner=student.key).put()

        wands = Wand.query().order(+Wand.core).fetch()
        wand_template = jinja_env.get_template('templates/wandlist.html')
        self.response.write(wand_template.render({'wands': wands}))

class LoadDataHandler(webapp2.RequestHandler):
    def get(self):
        seed_data()


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/houses', HouseHandler),
    ('/seed-data', LoadDataHandler),
    ('/wands', WandsHandler),
], debug=True)
