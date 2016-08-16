module.exports = {
    "env": {
        "browser": true,
    },
    "extends": "airbnb",
    "rules": {
        "linebreak-style": ["error", "unix"],
        "semi": ["error","never"],
         // Avoid code that looks like two expressions but is actually one
         // Allows omission of semicolons
         'no-unexpected-multiline': 2
    }
};
