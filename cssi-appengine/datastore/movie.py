class Movie(object):
    media_type = 'Movie'

    def __init__(self, mov_title, runtime, user_rating):
        self.title = mov_title
        self.runtime_mins = runtime
        self.rating = user_rating

    def autoplay(self):
        if (self.runtime_mins<=120) and (self.rating>=9.0):
            return "Up Next: " + self.title
        else:
            return "Search for More Movies"