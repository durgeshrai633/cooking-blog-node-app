require("../models/database");
const Catagory = require("../models/Catagory");
const Recipe = require("../models/Recipe");

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const categories = await Catagory.find({}).limit(5);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(5);
    const thai = await Recipe.find({ category: "Thai" }).limit(5);
    const american = await Recipe.find({ category: "American" }).limit(5);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(5);

    const food = { latest, thai, american, chinese };
    res.render("index", { title: "Coking blog - Home Page", categories, food });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

/**
 * GET /
 * Categories
 */

exports.exploreCategories = async (req, res) => {
  try {
    const categories = await Catagory.find({}).limit(20);
    res.render("categories", { title: "Coking blog - Catagories", categories });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let id = req.params.id;
    const categorieById = await Recipe.find({ category: id }).limit(20);
    res.render("categories", {
      title: "Coking blog - Catagories",
      categorieById,
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

/**
 * GET /recipe/:id
 * Recipes
 */

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    let recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Coking blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Coking blog - Search page", recipe });
  } catch (error) {}
};

exports.exploreLatest = async (req, res) => {
  let recipe = await Recipe.find({}).sort({ _id: -1 }).limit(20);
  res.render("explore-latest", {
    title: "Cooking blog - Explore Latest",
    recipe,
  });
};

exports.exploreRandom = async (req, res) => {
  let count = await Recipe.find().countDocuments();
  let random = Math.floor(Math.random() * count);
  let recipe = await Recipe.find().skip(random);
  res.render("explore-random", {
    title: "Cooking blog - Explore Random",
    recipe,
  });
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoError");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile, uplaodPath, newImageName;
    // if (!req.files || Object.keys(req.files).length == 0) {
    //   console.log("File is not uploaded");
    // } else {
    //   imageUploadFile = req.files.image;
    //   newImageName = Date.now() + imageUploadFile.name;
    //   uplaodPath = require("path").resolve(
    //     __dirname + "/public/uploads/" + newImageName
    //   );

    //   imageUploadFile.mv(uplaodPath, function (err) {
    //     if (err) return res.status(500).send(err);
    //   });
    // }
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/img/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();
    req.flash("infoSubmit", "Recipe is added");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoError", error.message);
    res.redirect("/submit-recipe");
  }
};

// async function insertCatagories() {
//   try {
//     await Catagory.insertMany([
//       { name: "Thai", image: "thai-food.jpg" },
//       { name: "American", image: "american-food.jpg" },
//       { name: "Chinese", image: "chinese-food.jpg" },
//       { name: "Maxicon", image: "maxicon-food.jpg" },
//       { name: "Indian", image: "indian-food.jpg" },
//       { name: "Spanish", image: "spanish-food.jpg" },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

// insertCatagories();

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
