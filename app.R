library(shiny)
library(r2d3)

# http://bl.ocks.org/syntagmatic/623a3221d3e694f85967d83082fd4a77
# https://gist.github.com/syntagmatic/623a3221d3e694f85967d83082fd4a77
# https://rstudio.github.io/r2d3/articles/gallery/cartogram/

ui <- fluidPage(
    d3Output("d3")
)

server <- function(input, output) {
    output$d3 <- renderD3({
        r2d3(data = jsonlite::read_json("us.json"), 
             css = "cartogram.css",
             container = "svg",
             d3_version = 4, 
             dependencies = c("topojson.min.js", "infants-1999-2015.txt"), 
             script = "cartogram.js")
    })
}

shinyApp(ui = ui, server = server)