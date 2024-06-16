# The Trailer Cron Service
There is a risk that the data in TSS becomes stales since the system stores external data, rather than fetching the data over and over again. To address this one more service would be needed, the trailer-cron-service.


_Due to time, and also, the fact it wouldn't show something new, I decided not to implement it. But for production it's needed._


It basically will make sure any changes that happens in the TMDB will propegate to this system.


## The Flow
- Cron trigger would trigger the job
- The Services would retrieve state, which is a timestamp, "last_run"
- The Services would request all changes that has happen since last run via https://developer.themoviedb.org/reference/movie-changes
- If trailers/movies has been updated, a message would be published to sqs*.
- State saved

_\* By just publishing the movie that needs to be updated, we don't need to duplicate the fetching logic. Instad the trailer-service will just handle it as a "new-content"._
