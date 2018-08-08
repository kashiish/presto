# Presto

[![Build Status](https://travis-ci.org/kashiish/presto.svg?branch=master)](https://travis-ci.org/kashiish/presto)

<p align="center">
  <img src="https://github.com/kashiish/presto/blob/master/presto.png?raw=true"/>
</p>

Presto is a simple vegan & vegetarian recipe search engine created using React. It is powered by the free [Edamam Recipe API](https://developer.edamam.com/edamam-docs-recipe-api).

I made this web app to get experience in using React technology. I spent a lot of time reading and learning about the best practices to follow, so I hope I did well!

I used `react-autosuggest` to create a typeahead suggestion box for recipe ideas. This recipe data comes from [`suggestions.json`](https://github.com/kashiish/presto/blob/master/public/assets/suggestions.json). You can get suggestions by searching with either recipe name, cuisine, or category (dip, dessert, breakfast, etc.).

Additionally, I added a feature where the user can see the ingredients for a specific recipe and check off the ones they have. Then, the app will try to find substitutes (with the [data](https://github.com/kashiish/presto/blob/master/public/assets/substitutions.json) it has) for the unchecked items. It does this by removing the "stop words" ([`stopwords.json`](https://github.com/kashiish/presto/blob/master/public/assets/stopwords.json)) and punctuation from each ingredient and comparing it with the ingredients in the substitutions data. Of course, this method has its defects. The ingredients data for a recipe can have extra information like specific brands (ex. "1 cup King Arthur flour") or preparation techniques (ex. "1 clove garlic finely minced"). I tried my best to add as many stop words to `stopwords.json` as I could to avoid missing substitutes.

The [Edamam API](https://developer.edamam.com/edamam-docs-recipe-api) also returns health details for each recipe, so I used `react-chartjs-2` to create a chart to depict that information.

## Issues and Contribution
Contribution is always welcome! 

I think something that could be improved is the efficiency of finding the substitutes, so if you have any ideas please feel free to submit a pull request.

Also, if you think of any more suggestions, stop words, or substitutes, you can submit an issue and I will add them to the list.

Lastly, if you encounter any issues please feel free to report or fix them.

### License
MIT
