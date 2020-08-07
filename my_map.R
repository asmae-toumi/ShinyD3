
# Goals -------------------------------------------------------------------

# Recreate a map similar to: http://bl.ocks.org/syntagmatic/623a3221d3e694f85967d83082fd4a77
# Using: https://github.com/dreamRs/r2d3maps


# Libraries ---------------------------------------------------------------
library(r2d3maps)
library(tidyverse)
library(tigris) 
library(sf)
library(rmapshaper) # to simplify the county geometries

# Data --------------------------------------------------------------------

# NYT COVID19 data
nyt <- read_csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv") %>%
  filter(date == "2020-08-01") %>% # just going to focus on one date
  drop_na(fips) %>%
  rename(GEOID = fips)

# Joining NYT to US county geometries
nyt_geo <- ms_simplify(tigris::counties(class = "sf")) %>%
  select(GEOID, geometry) %>%
  geo_join(nyt, by_sp = "GEOID", by_df = "GEOID")


# Map ---------------------------------------------------------------------

# When you run this, it will pull info from the js and css scripts
r2d3map(
  data = nyt_geo,
  script = "./my_map.js" 
) 




