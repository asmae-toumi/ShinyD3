
# Goals -------------------------------------------------------------------

# Recreate a map similar to: http://bl.ocks.org/syntagmatic/623a3221d3e694f85967d83082fd4a77
# Using: https://github.com/dreamRs/r2d3maps


# Libraries ---------------------------------------------------------------
library(r2d3maps)
library(tidyverse)
# to get county geometries
library(tigris) 
library(sf)
library(rmapshaper) # to simplify the county geometries
library(albersusa)
library(janitor)

# # Data --------------------------------------------------------------------
# 
# # NYT COVID19 data
# nyt <- read_csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv") %>%
#   filter(date == "2020-08-01") %>% # just going to focus on one date
#   drop_na(fips) %>%
#   rename(GEOID = fips)
# 
# # Joining NYT to US county geometries
# nyt_geo <- ms_simplify(tigris::counties(class = "sf")) %>%
#   select(GEOID, geometry) %>%
#   geo_join(nyt, by_sp = "GEOID", by_df = "GEOID")


infants <- read_delim("infants-1999-2015.txt", "\t", escape_double = FALSE, trim_ws = TRUE)

infants <- infants %>% clean_names() %>% rename(GEOID = county_code)

geometry <- tigris::counties(class = "sf") %>% # getting geometries
  select(GEOID, geometry) %>%
  ms_simplify() # rendering faster 

infants_simple <- geometry %>% geo_join(infants, 
                                       by_sp = "GEOID", by_df = "GEOID")

# d3_map(shape = infants_simple,
#        projection = "Albers",
#        width = "100%",
#        height = "100%") %>%
#   add_continuous_breaks(var = "population", na_color = "#b8b8b8") %>%
#   add_tooltip(value = "{county} : {population}")

# Map ---------------------------------------------------------------------

# When you run this, it will pull info from the js and css scripts
r2d3map(
  data = infants_simple$population,
  script = "./my_map.js"
)


  