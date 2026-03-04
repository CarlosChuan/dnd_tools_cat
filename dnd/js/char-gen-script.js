var backgrounds, books, cardsources, classes, life, names, npcs, other, races,
    character = {}, prevCharacters = [],
    characterType = "either",
    usedBooks = [],
    mcEthnicity = "",
    ethnicityOption = "",
    defaultRaceSectionClass,
    lock = {
        "name": false,
        "traits": false,
        "occupation": false,
        "race": false,
        "class": false,
        "background": false,
        "life": false,
        "all": ["name", "traits", "occupation", "gender", "race", "class", "background", "life"]
    };

// Populate the dropdowns with material from the selected books
var Dropdowns = {
    Update: function () {
        BookFunctions.Get();
        $("#racemenu").html(this.GetDropdownOptions(races));
        $("#classmenu").html(this.GetDropdownOptions(classes));
        $("#backgroundmenu").html(this.GetDropdownOptions(backgrounds));
    },

    GetDropdownOptions: function (list) {
        let optionsArray = ["<option value=\"Random\">Aleatori</option>"];
        for (let propertyName in list) {
            let item = list[propertyName];
            if (typeof item != "object" || !item.hasOwnProperty("_special") || BookFunctions.CheckSpecial(item._special))
                optionsArray.push("<option value=\"" + propertyName + "\">" + propertyName + "</option>");
        }
        return optionsArray.join("");
    },
}

// Get or check what books we have
var BookFunctions = {
    // Get the books we have from the checkboxes
    Get: function () {
        usedBooks = ["Real", "PHB"];
        for (let bookNum = 0; bookNum < books.availableBooks.length; bookNum++) {
            let book = books.availableBooks[bookNum];
            if ($("#" + book + "box").prop("checked"))
                usedBooks.push(book);
        }
    },

    // Check an entire _special string
    CheckSpecial: function (specialString) {
        let splitSpecial = specialString.split(" ");
        for (let specialIndex = 0; specialIndex < splitSpecial.length; specialIndex++) {
            if (splitSpecial[specialIndex].slice(0, 5) == "book-")
                return this.CheckString(splitSpecial[specialIndex].slice(5));
        }
        return false;
    },

    // Check a string of only books
    CheckString: function (bookString) {
        for (let index = 0; index < usedBooks.length; index++) {
            if (bookString.includes(usedBooks[index]))
                return true;
        }
        return false;
    }
}

var CharacterType = {
    GetNoCard: function () {
        characterType = $("#pc-radio").prop("checked") ? "pc" : $("#npc-radio").prop("checked") ? "npc" : "either";
        if (characterType == "pc") {
            $(".pc-show, .pc-only-show").show();
            $(".npc-show, .npc-only-show").hide();
            $("#race-section").prop("class", defaultRaceSectionClass);
            $("#name-lock-div").removeClass("col-lg-4");
        } else if (characterType == "npc") {
            $(".npc-show, .npc-only-show").show();
            $(".pc-show, .pc-only-show").hide();
            $("#race-section").prop("class", "col-12");
            $("#name-lock-div").addClass("col-lg-4");
        } else {
            $(".pc-show, .npc-show").show();
            $(".pc-only-show, .npc-only-show").hide();
            $("#race-section").prop("class", defaultRaceSectionClass);
            $("#name-lock-div").addClass("col-lg-4");
        }
    },
    Get: function () {
        this.GetNoCard();
        CardType.Set();
    }
}

// For when the user clicks one of the Generate buttons, or when the page loads
var Generate = {
    All: function () {
        BookFunctions.Get();

        this.Race();
        this.Gender();
        this.Class();
        this.Background();
        this.Occupation();
        this.NPCTraits();
        this.Life();

        this.FinishGenerate();
    },

    Race: function () {
        if (lock.race) return;
        // Determine human ethnicity
        ethnicityOption = $("#standard-radio").prop("checked") ? "standard" :
            $("#real-radio").prop("checked") ? "real" :
                Random.Array(["standard", "real"]);

        // Determine race weight
        let raceVal = $("#racemenu").val();
        character.Race = Content.GetRandom(races, raceVal == "Random" ?
            $("#weighted-radio").prop("checked") ? RaceWeighted.Get() :
                $("#15x-weighted-radio").prop("checked") ? RaceWeighted.Get(1.5) :
                    $("#20x-weighted-radio").prop("checked") ? RaceWeighted.Get(2) :
                        "Random" : raceVal);
    },

    Gender: function () {
        let genderVal = $("#gendermenu").val();
        character.Gender = (genderVal == "Random" ? Random.Array(other.genders) : genderVal);

        this.Name();
    },

    Name: function () {
        let nameVal = $("#name-input").val();
        if (nameVal.length == 0) {
            character.Name = Names.Get(character.Race.name, character.Gender);
            character.ShortName = Names.Shortened();
        }
        else {
            character.Name = nameVal;
            character.ShortName = nameVal;
        }
    },

    Class: function () {
        if (lock.class) return;
        character.Class = Content.GetRandom(classes, $("#classmenu").val());
    },

    Background: function () {
        if (lock.background) return;
        character.Background = Content.GetRandom(backgrounds, $("#backgroundmenu").val());
    },

    Occupation: function () {
        if (lock.occupation) return;
        character.Occupation = Occupation.Get();
    },

    NPCTraits: function () {
        if (lock.traits) return;
        character.NPCTraits = {
            "name": "NPCTraits",
            "content": Content.Get(NPCTraits.Get())
        };
    },

    Life: function () {
        if (lock.life) return;
        character.Life = {
            "name": "Life",
            "content": Content.Get(Life.Get())
        };
    },

    // Functions for when a specific button is pressed

    RaceInput: function () {
        BookFunctions.Get();
        this.Race();
        this.Name();
        this.Life();
        CardType.Set();
        this.FinishGenerate();
    },

    GenderInput: function () {
        this.Gender();
        this.FinishGenerate();
    },

    NameInput: function () {
        BookFunctions.Get();
        this.Name();
        this.FinishGenerate();
    },

    ClassInput: function () {
        BookFunctions.Get();
        this.Class();
        this.FinishGenerate();
    },

    BackgroundInput: function () {
        BookFunctions.Get();
        this.Background();
        this.FinishGenerate();
    },

    OccupationInput: function () {
        BookFunctions.Get();
        this.Occupation();
        this.FinishGenerate();
    },

    NPCTraitsInput: function () {
        BookFunctions.Get();
        this.NPCTraits();
        this.FinishGenerate();
    },

    LifeInput: function () {
        BookFunctions.Get();
        this.Life();
        this.FinishGenerate();
    },

    FinishGenerate: function () {
        CardType.Set();
        Characters.SaveCharacter();
        Characters.SaveToStorage();
        SetHTML();
    }
}

function SetHTML() {

    $("#name").html(character.Name);

    $("#race, #raceheader").html(character.Race.name);
    $("#racesection").html(HTMLStrings.Get(character.Race));

    $("#gender, #genderheader").html(character.Race.name == "Warforged" ? "Sense gènere" : character.Gender);

    $("#class, #classheader").html(character.Class.name);
    $("#classsection").html(HTMLStrings.Get(character.Class));

    $("#background, #backgroundheader").html(character.Background.name);
    $("#backgroundsection").html(HTMLStrings.Get(character.Background));

    $("#occupation").html(character.Occupation);

    $("#npc-traits-section").html(HTMLStrings.Get(character.NPCTraits));

    $("#lifesection").html(HTMLStrings.Get(character.Life));
}

// Gets content from dnd-data and puts it into a format more readable to the generator (also filters out things that should be inaccessible)
var Content = {
    // Set all properties in an object
    Get: function (item) {
        if (item == null) return null;
        if (typeof item == "object") {
            if (Array.isArray(item))
                return this.Get(Random.Array(item));
            else {
                if (item.hasOwnProperty("_special")) {
                    let specialItem = this.Special(item);
                    if (jQuery.isEmptyObject(specialItem))
                        return null;
                    return specialItem;
                }
                let properties = [];
                for (let propertyName in item) {
                    let content = this.Get(item[propertyName]);
                    if (content != null)
                        properties.push({
                            "name": propertyName,
                            "content": content
                        });
                }
                return properties;
            }
        }
        return item;
    },

    // Get a random property from an initial object
    GetRandom: function (item, dropdownVal = "Random") {
        if (dropdownVal != "Random")
            return {
                "name": dropdownVal,
                "content": this.Special(item[dropdownVal])
            };
        let propsArr = [],
            randomProp;
        for (let propName in item) {
            if (item[propName].hasOwnProperty("_special") && BookFunctions.CheckSpecial(item[propName]._special))
                propsArr.push(propName);
        }
        randomProp = Random.Array(propsArr);
        return {
            "name": randomProp,
            "content": this.Special(item[randomProp])
        };
    },


    // For dealing with special cases (indicated by the _special keyword)

    Special: function (item) {
        // Clone the item, remove special from the clone, and apply every special in order
        let newItem = Object.assign({}, item),
            cases = item._special.split(" ");
        delete newItem._special;
        for (let caseIndex = 0; caseIndex < cases.length; caseIndex++)
            newItem = this.ApplySpecial(cases[caseIndex], newItem);
        if (jQuery.isEmptyObject(newItem))
            return null;
        return this.Get(newItem);
    },

    ApplySpecial: function (special, specialItem) // Apply one special case to an object and return the resulting object
    {
        if (specialItem == null || typeof specialItem != "object") return specialItem;
        let splitSpecial = special.split("-");

        switch (splitSpecial[0]) {
            case "book": // Remove this item if we don't have the necessary book
                return BookFunctions.CheckString(splitSpecial[1]) ? specialItem : null;

            case "booksort": // Take a bunch of arrays and make a composite array, discarding data from books we don't have. Then pick randomly from it.
                return this.BookSort(specialItem);

            case "characteristics": // Output height, weight, appearance, etc
                return this.GetCharacteristics(specialItem);

            case "gendersort": // Get property according to gender
                return character.Gender == "Masculí" ? specialItem["Masculí"] :
                    character.Gender == "Femení" ? specialItem["Femení"] :
                        Random.Array([specialItem["Masculí"], specialItem["Femení"]]);

            case "halfethnicity": // Get human ethnicity for half-humans
                mcEthnicity = (Random.Num(5) > 0 ? RandomEthnicity.Get() : "Desconeguda");
                return mcEthnicity;

            case "humanethnicity": // Get human ethnicity for full-humans
                mcEthnicity = RandomEthnicity.Get();
                return mcEthnicity;

            case "subracesort": // For certain races, we need to know the subrace to determine the physical characteristics. This is less hacky than the code it replaced.
                let SubracePropName = (splitSpecial.length > 1 ? (splitSpecial[1].split("_").join(" ")) : "Subraça"),
                    subracesAndVariants = specialItem["Subracies i Variants"],
                    newSubVar = {},
                    subraceString;

                for (let propertyName in subracesAndVariants) {
                    if (propertyName == SubracePropName) {
                        subraceString = Array.isArray(subracesAndVariants[propertyName]) ?
                            Random.Array(subracesAndVariants[SubracePropName]) :
                            this.BookSort(subracesAndVariants[SubracePropName]);
                        newSubVar[propertyName] = subraceString;
                    } else
                        newSubVar[propertyName] = subracesAndVariants[propertyName];
                }
                // specialItem["Subracies i Variants"] = newSubVar;
                // specialItem["Característiques Físiques"] = specialItem["Característiques Físiques"][subraceString];
                return {
                    "Subracies i Variants": newSubVar,
                    "Característiques Físiques": specialItem["Característiques Físiques"][subraceString]
                };

            case "dragonbornvarianttype": // Wildemount dragonborn have weird variants
                if (!usedBooks.includes("EGtW"))
                    return null;
                return Random.Array(specialItem._array);

            case "dragonmarkvariant": // Eberron dragonmarks
                if (!usedBooks.includes("EBR") || Random.Num(2) == 0)
                    return null;
                return Random.Array(specialItem._array);

            case "tieflingappearance": // Tieflings have weird appearances
                if (Random.Num(3) == 0)
                    return null;
                return Random.ArrayMultiple(specialItem._array, Random.DiceRoll("1d4") + 1);

            case "tieflingvarianttype": // Tieflings also have weird variants
                if (!usedBooks.includes("SCAG"))
                    return null;
                return Random.Array(specialItem._array);

            case "monstrousorigin": // Monster origins
                return Random.Array(other.monstrousOrigins);

            case "backgroundtraits": // For the SCAG backgrounds where the writers were lazy and used personalities from the PHB 
                let backgroundCopy = backgrounds[splitSpecial[1].split("_").join(" ")];
                // specialItem["Trait"] = backgroundCopy.Trait;
                // specialItem["Ideal"] = backgroundCopy.Ideal;
                // specialItem["Bond"] = backgroundCopy.Bond;
                // specialItem["Flaw"] = backgroundCopy.Flaw;
                return {
                    "Tret de Personalitat": backgroundCopy["Tret de Personalitat"],
                    "Ideal": backgroundCopy.Ideal,
                    "Vincle": backgroundCopy["Vincle"],
                    "Defecte": backgroundCopy["Defecte"]
                };

            case "ravnicacontacts": // Ravnica Backgrounds
                let guildName = specialItem["_name"],
                    ravnicaContacts = {};
                ravnicaContacts[guildName + " Aliat"] = Random.Array(specialItem["_guild"]);
                ravnicaContacts[guildName + " Rival"] = Random.Array(specialItem["_guild"]);
                let nonGuildContact = Random.Array(specialItem["_nonguild"]);
                if (nonGuildContact == "_reroll") {
                    nonGuildContact = Random.Array(specialItem["_guild"]);
                    ravnicaContacts["Contacte de " + guildName + " addicional"] = nonGuildContact
                }
                else
                    ravnicaContacts["Contacte no de " + guildName] = nonGuildContact;
                return ravnicaContacts;

            case "dimircontacts": // Ravnica Backgrounds, House Dimir is a special case
                let dimirContacts = {}, secondaryGuild = Random.Array(specialItem._guilds),
                    otherGuildContacts = backgrounds[secondaryGuild.background]["Contacts"]["_guild"];
                dimirContacts["Aliat Dimir"] = Random.Array(specialItem["_dimircontact"]);
                dimirContacts["Gremi secundari"] = secondaryGuild.name;
                dimirContacts["Aliat del gremi secundari"] = Random.Array(otherGuildContacts);
                dimirContacts["Rival del gremi secundari"] = Random.Array(otherGuildContacts);
                return dimirContacts;
            //"Roll an additional Azorius contact; you can decide if the contact is an ally or a rival.",
        }
        return specialItem;
    },

    // Remove every array that's non-applicable because we don't have the book, then merge the remaining arrays and pick randomly from them
    BookSort: function (specialItem) {
        if (specialItem.hasOwnProperty("_special"))
            delete specialItem._special;
        let contentArr = [];
        for (let bookName in specialItem) {
            if (BookFunctions.CheckString(bookName))
                contentArr = contentArr.concat(specialItem[bookName]);
        }
        return Random.Array(contentArr);
    },

    // Compute age, height, weight, and other physical characteristics
    GetCharacteristics: function (item) {
        let chaObj = {},
            age = Random.Num(item.maxage - item.minage) + item.minage;
        age += (age == "1" ? " any" : " anys"); // Extremely rare edge case but it can happen
        chaObj.Edat = age;

        let heightmod = Random.DiceRoll(item.heightmod),
            intHeight = item.baseheight + heightmod;
        chaObj.Alçada = Math.floor(intHeight / 12) + "'" + (intHeight % 12) + "\"";
        chaObj.Pes = item.baseweight + heightmod * Random.DiceRoll(item.weightmod) + " lbs.",
            otherObj = item._other;

        if (otherObj == undefined)
            return chaObj;
        for (let otherName in otherObj)
            chaObj[otherName] = otherObj[otherName];
        return chaObj;
    }
}

// Functions for random number/content selecting
var Random = {
    // Generate random number
    Num: function (max) {
        return Math.floor(Math.random() * max);
    },

    // Pick a random element from an array
    Array: function (arr) {
        return arr[this.Num(arr.length)];
    },

    // Pick multiple random elements from an array
    ArrayMultiple: function (arr, num) {
        let returnArray = [];
        while (returnArray.length < num) {
            let item = this.Array(arr);
            if (!returnArray.includes(item))
                returnArray.push(item);
        }
        return returnArray.join(", ");
    },

    // Roll dice based on a string (eg. '2d6')
    DiceRoll: function (roll) {
        numbers = roll.split("d");
        if (numbers.length == 1)
            return numbers[0];
        let total = 0;
        for (let die = 0; die < numbers[0]; die++)
            total += this.Num(numbers[1]) + 1;
        return total;
    },
}

// Functions for making content objects into HTML strings to be displayed
var HTMLStrings = {
    Get: function (item) {
        let itemContent = item.content,
            stringBuffer = [];
        for (let index = 0; index < itemContent.length; index++)
            stringBuffer.push(this.GetNext(itemContent[index]));
        return stringBuffer.join("");
    },

    GetNext: function (item) {
        let itemContent = item.content;
        if (typeof itemContent != "object")
            return "<li><b>" + item.name + "</b>: " + itemContent + "</li>";

        let stringBuffer = [];
        for (let index = 0; index < itemContent.length; index++)
            stringBuffer.push(this.GetNext(itemContent[index]));
        return "<li><b> " + item.name + "</b>:<ul>" + stringBuffer.join("") + "</ul></li>";
    },

    Life: function (item) {
        if (typeof item == "object") {
            let itemContent = item.content,
                stringBuffer = [];
            for (let propertyName in itemContent)
                stringBuffer.push(this.Life(itemContent[propertyName]));
            return stringBuffer.join("");
        }
        return item;
    },
}

// Functions relating to the character's name
var Names = {
    Get: function (raceName, gender) {
        switch (raceName) {
            case "Aarakocra":
            case "Changeling":
            case "Grung":
            case "Kenku":
            case "Kobold":
            case "Lizardfolk":
            case "Locathah":
            case "Shifter":
            case "Tortle":
            case "Verdan":
            case "Warforged":
                return Random.Array(names[raceName]);

            case "Bugbear":
            case "Goblin":
            case "Hobgoblin":
                return this.GetGendered(names["Goblinoid"], gender);

            case "Centaur":
            case "Minotaur":
            case "Orc":
            case "Leonin":
            case "Loxodon":
            case "Vedalken":
                return this.GetGendered(names[raceName], gender);

            case "Aasimar":
            case "Dhampir":
            case "Genasi":
            case "Hexblood":
            case "Reborn":
                return this.GetHuman(this.GetHumanEthnicity(), gender);

            case "Dragonborn":
                return this.FirstnameLastname(names.Dragonborn, "Clan", gender);

            case "Dwarf":
                if (this.GetSubrace() == "Duergar")
                    return this.GetGendered(names.Dwarf, gender) + " " + Random.Array(names.Dwarf["Clan (Duergar)"]);
                return this.FirstnameLastname(names.Dwarf, "Clan", gender);

            case "Elf":
                if (this.GetSubrace() == "Drow")
                    return this.FirstnameLastname(names.Drow, "Family", gender);
                if (this.GetSubrace() == "Shadar-kai")
                    return this.GetGendered(names["Shadar-kai"], gender);
                return character.age < 80 + Random.Num(40) ?
                    Random.Array(names.Elf.Child) + " " + Random.Array(names.Elf.Family) :
                    this.FirstnameLastname(names.Elf, "Family", gender);

            case "Firbolg":
                return this.GetGendered(names.Elf, gender);

            case "Gith":
                return this.GetSubrace() == "Githyanki" ?
                    this.GetGendered(names.Githyanki, gender) :
                    this.GetGendered(names.Githzerai, gender);

            case "Gnome":
                if (this.GetSubrace() == "Deep Gnome")
                    return this.FirstnameLastname(names["Deep Gnome"], "Clan", gender);
                let firstNames, numNames = 4 + Random.Num(4);
                let gnomeNames = [];
                while (gnomeNames.length < numNames) {
                    let item;
                    if (gender == "Male" || gender == "Female")
                        item = Random.Array(names.Gnome[gender]);
                    else
                        item = Random.Array(names.Gnome[this.RandomGender()]);
                    if (!gnomeNames.includes(item))
                        gnomeNames.push(item);
                }
                firstNames = gnomeNames.join(" ");
                return firstNames + " \"" + Random.Array(names.Gnome.Nickname) + "\" " + Random.Array(names.Gnome.Clan);

            case "Goliath":
                return Random.Array(names.Goliath.Birth) + " \"" + Random.Array(names.Goliath.Nickname) + "\" " + Random.Array(names.Goliath.Clan);

            case "Halfling":
                return this.FirstnameLastname(names.Halfling, "Family", gender);

            case "Half-Elf":
                let hElfRand = Random.Num(6),
                    elfSubrace = this.GetSubrace(),
                    elfNameArray =
                        elfSubrace == "Drow" ? names.Drow : names.Elf;
                if (hElfRand < 2) return this.HumanFirst(this.GetHumanEthnicity(), gender) + " " + Random.Array(elfNameArray.Family); // Human First, Elf Last
                if (hElfRand < 4) return this.GetGendered(elfNameArray, gender) + this.HumanLast(this.GetHumanEthnicity()); // Elf first, Human Last
                if (hElfRand < 5) return this.GetHuman(this.GetHumanEthnicity(), gender); // Both Human
                return this.FirstnameLastname(elfNameArray, "Family", gender); // Both Elf

            case "Half-Orc":
                let hOrcRand = Random.Num(4);
                return hOrcRand < 1 ? this.GetGendered(names.Orc, gender) :
                    hOrcRand < 2 ? this.GetGendered(names.Orc, gender) + this.HumanLast(this.GetHumanEthnicity()) :
                        this.GetHuman(this.GetHumanEthnicity(), gender);

            case "Human":
                return this.GetHuman(mcEthnicity, gender);

            case "Kalashtar":
                return Random.Array(names["Kalashtar/Quori"]);

            case "Leonin":
                return this.FirstnameLastname(names.Leonin, "Pride", gender);

            case "Satyr":
                return this.GetGendered(names.Satyr, gender) + " \"" + Random.Array(names.Satyr.Nicknames) + "\"";

            case "Simic Hybrid":
                let raceNames = Random.Array([names.Human, names.Elf, names.Vedalken]);
                return raceNames == names.Human ? this.GetHuman(RandomEthnicity.Get(), gender) : this.GetGendered(raceNames, gender);

            case "Tabaxi":
                return Random.Array(names.Tabaxi.Name) + " " + Random.Array(names.Tabaxi.Clan);

            case "Triton":
                return this.FirstnameLastname(names.Triton, "Surname", gender);

            case "Tiefling":
                if (Random.Num(5) < 2)
                    return this.GetHuman(this.GetHumanEthnicity(), gender);
                let lastName = this.HumanLast(this.GetHumanEthnicity());
                return gender == "Male" || gender == "Female" ?
                    Random.Num(3) == 0 ? this.GetGendered(names.Infernal, gender) + lastName : Random.Array(names.Virtue) + lastName :
                    Random.Num(3) > 0 ? Random.Array(names.Virtue) + lastName : this.GetGendered(names.Infernal, gender) + lastName;

            case "Yuan-Ti Pureblood":
                return Random.Array(names["Yuan-Ti"]);
        }
    },

    Shortened: function () {
        if (character.Race.name == "Gnome" && character.Race.content[0].content[0].content != "Deep Gnome") {
            let nameArr = character.Name.split(" "),
                firstName = nameArr[Random.Num(nameArr.length - 2)];
            return firstName + " " + nameArr[nameArr.length - 2] + " " + nameArr[nameArr.length - 1];
        } else if (character.Race.name == "Tabaxi") {
            let nicknameIndex = character.Name.indexOf("\"");
            return character.Name.substring(nicknameIndex);
        }
        return character.Name;
    },

    RandomGender: () => Random.Array(["Male", "Female"]),

    GetSubrace: function () {
        let race = character.Race.content
        for (let index = 0; index < race.length; index++) {
            if (race[index].name == "Subracies i Variants") {
                let subrace = race[index].content;
                for (let index2 = 0; index2 < subrace.length; index2++) {
                    if (subrace[index2].name == "Subraça")
                        return subrace[index2].content;
                }
            }
        }
    },

    // Return a gendered first name and a last name based on race
    FirstnameLastname: function (names, lastnameType, gender) {
        return this.GetGendered(names, gender) + " " + Random.Array(names[lastnameType]);
    },

    // Get the gender or a random generator if the character doesn't have one
    GetGendered: function (names, gender) {
        return Random.Array(names[(gender == "Male" || gender == "Female" ? gender : this.RandomGender())]);
    },

    // Get a human name
    GetHuman: function (ethnicity, gender) {
        let lastName = this.HumanLast(ethnicity);
        return this.HumanFirst(ethnicity, gender) + (lastName != null ? lastName : "");
    },

    HumanFirst: function (ethnicity, gender) {
        return ethnicityOption == "standard" ?
            this.GetGendered(ethnicity == "Tethyrian" ? names.Human.Chondathan : names.Human[ethnicity], gender) :
            this.GetGendered(names["Human (Real)"][ethnicity], gender);
    },

    HumanLast: function (ethnicity) {
        return ethnicityOption == "standard" ?
            ethnicity == "Bedine" ? " " + Random.Array(names.Human.Bedine.Tribe) :
                ethnicity == "Tethyrian" ? " " + Random.Array(names.Human.Chondathan.Surname) :
                    (ethnicity == "Tuigan" || ethnicity == "Ulutiun") ? "" : " " + Random.Array(names.Human[ethnicity].Surname) : "";
    },

    // Get character's human heritage - for half-elves, half-orcs, tieflings, aasimar, and genasi
    GetHumanEthnicity: () => (mcEthnicity == "Unknown" ? RandomEthnicity.Get() : mcEthnicity),
}

// Determine race based on weighted probabilities (ie. more common races are more likely to come up)
var RaceWeighted = {
    Get: function (pow = 1) {
        let raceWeightList = [], totalWeight = 0;
        for (let raceName in other.raceWeights) {
            let weight = Math.pow(other.raceWeights[raceName], pow);
            raceWeightList[raceName] = weight;
            totalWeight += weight;
        }
        for (let raceName in races) {
            let race = races[raceName];
            if (race._special.includes("PHB") || !BookFunctions.CheckSpecial(race._special)) continue;
            raceWeightList[raceName] = 1;
            totalWeight += 1;
        }
        let rand = Random.Num(totalWeight);
        for (let race in raceWeightList) {
            rand -= raceWeightList[race];
            if (rand <= 0)
                return race;
        }
    }
}

// Oddball function for returning a random human ethnicity
var RandomEthnicity = {
    Get: function () {
        return ethnicityOption == "standard" ?
            usedBooks.includes("SCAG") ?
                Random.Array(races.Human["Subracies i Variants"].Ètnia.PHB.concat(races.Human["Subracies i Variants"].Ètnia.SCAG)) :
                Random.Array(races.Human["Subracies i Variants"].Ètnia.PHB) :
            Random.Array(races.Human["Subracies i Variants"].Ètnia.Real);
    }
}

// Return random traits as given in the NPC section of the DMG
var NPCTraits = {
    Get: function () {
        let newNPCTraits = {
            "Aparença": Random.Array(npcs.appearances)
        },
            highTraitNum = Random.Num(npcs.highAbilities.length),
            lowTraitNum = Random.Num(npcs.lowAbilities.length - 1);

        // Low ability can't be the same as the high ability
        if (lowTraitNum >= highTraitNum)
            lowTraitNum++;

        newNPCTraits["Habilitat Alta"] = npcs.highAbilities[highTraitNum];
        newNPCTraits["Habilitat Baixa"] = npcs.lowAbilities[lowTraitNum];

        newNPCTraits["Talent"] = Random.Array(npcs.talents);
        newNPCTraits["Manera de ser"] = Random.Array(npcs.mannerisms);
        newNPCTraits["Tret d'interacció"] = Random.Array(npcs.interactionTraits);

        let ideal = Random.Array(npcs.ideals),
            bond, bond1 = Random.Num(10)
        if (bond1 < 9)
            bond = npcs.bonds[bond1];
        else {
            bond1 = Random.Num(9);
            let bond2 = Random.Num(9);
            while (bond2 == bond1)
                bond2 = Random.Num(9);
            bond = npcs.bonds[bond1] + ", " + npcs.bonds[bond2];
        }
        newNPCTraits["Valors"] = ideal + ", " + bond;

        newNPCTraits["Defecte o Secret"] = Random.Array(npcs.flawsAndSecrets);
        return newNPCTraits;
    }
}

var Occupation = {
    Get: function (allowAdventurer) {
        let rand = Random.Num(allowAdventurer ? 100 : 99);
        return rand < 5 ? "Acadèmic" :
            rand < 10 ? "Aristòcrata" :
                rand < 25 ? "Artesà o membre d'un gremi" :
                    rand < 30 ? "Criminal" :
                        rand < 35 ? "Animador/a" :
                            rand < 37 ? "Exiliat, ermità o refugiat" :
                                rand < 42 ? "Explorador o vagabund" :
                                    rand < 54 ? "Pagès o pastor" :
                                        rand < 59 ? "Caçador o trampaire" :
                                            rand < 74 ? "Obrer" :
                                                rand < 79 ? "Comerciant" :
                                                    rand < 84 ? "Polític o buròcrata" :
                                                        rand < 89 ? "Sacerdot" :
                                                            rand < 94 ? "Mariner" :
                                                                rand < 99 ? "Soldat" :
                                                                    "Aventurer (" + Life.ClassWeighted() + ")";
    },
}

// Return random life events as given in Xanathar's guide
var Life = {
    Get: function () {
        let newLife = {};
        newLife["Alineament"] = Random.Array(life.alignments);
        newLife["Origen"] = {};
        if (character.Race.name == "Warforged")
            newLife["Origen"]["Construït"] = Random.Array(life.origins.Birthplace);
        else
            newLife["Origen"]["Lloc de Naixement"] = Random.Array(life.origins.Birthplace);
        let parents = life.origins.Parents[character.Race.name];
        if (parents != undefined)
            newLife["Origen"]["Pares"] = Random.Array(parents);

        let raisedBy = this.RaisedBy();
        if (raisedBy != "Mare i pare")
            newLife["Procedent de"] = raisedBy;
        newLife["Pare absent"] = this.AbsentParent();

        let lifestyle = this.Lifestyle();
        newLife["Estil de vida familiar"] = lifestyle[0];
        newLife["Llar d'infantesa"] = this.Home(lifestyle[1]);
        newLife["Records d'infantesa"] = this.Memories();

        let siblings = this.Siblings(newLife["Origen"]["Pares"]);
        newLife["Germans"] = siblings;

        let lifeEvents = this.LifeEvents();
        newLife["Esdeveniments de la vida"] = lifeEvents;
        newLife["Andròmina"] = Random.Array(life.trinkets);

        return newLife;
    },

    LifeEvents: function () {
        let lifeEvents = {};
        let numEvents = 3 + Random.Num(3);
        for (let eventNum = 0; eventNum < numEvents; eventNum++) {
            let newEventType = "";
            do {
                let randomEventNum = Random.Num(100);
                newEventType = randomEventNum == 99 ? "Cosa Estranya" :
                    life.eventTables["Life Events"][Math.floor(randomEventNum / 5)];
            } while (lifeEvents.hasOwnProperty([newEventType]))

            let newEvent = "";
            switch (newEventType) {
                case "Matrimoni":
                    let spouseRace;
                    if (Random.Num(3) < 2)
                        spouseRace = character.Race.name;
                    else
                        spouseRace = RaceWeighted.Get();
                    newEvent = "Et vas enamorar o et vas casar amb un/a " + this.People() + ".";
                    break;
                case "Amic":
                    newEvent = "Vas fer amistat amb un/a " + this.People() + ".";
                    break;
                case "Enemic":
                    newEvent = "Te vas fer enemic d'un/a " + this.People() + ". Tira un d6. Un número senar indica que tu tens la culpa de la ruptura, i un número parell indica que ets innocent.";
                    break;
                case "Feina":
                    newEvent = "Vas passar temps treballant en una feina relacionada amb el teu rerefons. Comença la partida amb 2d6 po extres.";
                    break;
                case "Persona important":
                    let attitude = Random.Array(["hostil", "amistós", "indiferent"]);
                    newEvent = "Vas conèixer una persona important (" + this.People() + "), que és " + attitude + " cap a tu.";
                    break;
                case "Aventura":
                    let rand = Random.Num(100);
                    newEvent = rand == 99 ? life.eventTables["Aventura"][10] : life.eventTables["Aventura"][Math.floor(rand / 10)];
                    break;
                case "Crim":
                    newEvent = Random.Array(life.eventTables["Crim"]) + ". " + Random.Array(life.eventTables["Càstig"]);
                    break;
                default:
                    newEvent = Random.Array(life.eventTables[newEventType]);
                    break;
            }
            lifeEvents[newEventType] = newEvent;
        }
        return lifeEvents;
    },

    Siblings: function (parents) // Determine who our siblings are
    {
        let numSiblings = Random.Num(3);
        if (numSiblings == 0) return null;
        siblings = {};
        for (let sibNum = 0; sibNum < numSiblings; sibNum++) {
            let newSib = {},
                race = this.SiblingRace(parents);
            if (race != "Warforged")
                newSib["Gènere"] = Random.Array(other.genders);
            newSib["Raça"] = race;
            newSibName = this.SiblingName(newSib);
            while (newSibName == character.Name.substring(0, newSibName.length))
                newSibName = this.SiblingName(newSib);
            newSib["Alineament"] = this.Alignment();
            newSib["Ocupació"] = Occupation.Get(true);
            newSib["Estat"] = this.Status();

            newSib["Relació"] = this.Relationship();

            let birthOrderRoll = Random.DiceRoll("2d6"),
                birthOrder;
            if (newSib["Raça"] == "Warforged") {
                birthOrder = birthOrderRoll < 3 ? "Simultani" :
                    birthOrderRoll < 8 ? "Gran" : "Petit"
                newSib["Ordre de Construcció"] = birthOrder;
            } else {
                birthOrder = birthOrderRoll < 3 ? "Bessons, trigèmins o quàdruples" :
                    birthOrderRoll < 8 ? "Gran" : "Petit"
                newSib["Ordre de Naixement"] = birthOrder;
            }
            siblings[newSibName] = newSib;
        }
        return siblings;
    },

    SiblingRace: function (parents) // If mixed-race, determine races of siblings
    {
        switch (character.Race.name) {
            case "Half-Elf":
                return parents == "Un dels progenitors era un elf i l'altre era un mig-elf." ?
                    Random.Array(["Elf", "Half-Elf"]) :
                    parents == "Un dels progenitors era un humà i l'altre era un mig-elf." ?
                        Random.Array(["Human", "Half-Elf"]) : "Half-Elf";
            case "Half-Orc":
                return parents == "Un dels progenitors era un orc i l'altre era un mig-orc." ?
                    Random.Array(["Orc", "Half-Orc"]) :
                    parents == "Un dels progenitors era un humà i l'altre era un mig-orc." ?
                        Random.Array(["Human", "Half-Orc"]) : "Half-Orc";
            case "Tiefling":
                return parents == "Ambdós progenitors eren humans, la seva herència infernal va estar latent fins que vas arribar tu." ?
                    Random.Array(["Human", "Human", "Human", "Tiefling"]) :
                    parents == "Un dels progenitors era un tiefling i l'altre era un humà." ?
                        Random.Array(["Human", "Tiefling"]) : "Tiefling";
            case "Genasi":
                return parents == "Un dels progenitors era un geni i l'altre era un humà." ?
                    Random.Array(["Human", "Genasi"]) :
                    parents == "Ambdós progenitors eren humans, la seva herència elemental va estar latent fins que vas arribar tu." ?
                        Random.Array(["Human", "Human", "Human", "Genasi"]) : "Genasi";
            case "Aasimar":
                return parents == "Ambdós progenitors eren humans, la seva herència celestial va estar latent fins que vas arribar tu." ?
                    "Human" : Random.Array(["Human", "Aasimar"]);
        }
        return character.Race.name;
    },

    // Random tables

    SiblingName: function (sibling) {
        let siblingRace = sibling["Raça"],
            name;
        if (siblingRace == "Tabaxi")
            return Random.Array(names.Tabaxi.Name);
        else
            name = (siblingRace == "Human" && character.Race.name != "Human") ?
                Names.GetHuman(Names.GetHumanEthnicity(), sibling["Gènere"]) :
                Names.Get(sibling["Raça"], sibling["Gènere"]);
        let lastSpace = name.lastIndexOf(" ");
        return lastSpace < 0 ? name : name.substring(0, lastSpace);
    },

    Alignment: function () {
        let roll = Random.DiceRoll("3d6");
        return roll < 3 ? "Lícit Maligne" :
                roll < 5 ? "Caòtic Maligne" :
                roll < 9 ? "Neutral Maligne" :
                roll < 13 ? "Neutral Pur" :
                roll < 16 ? "Neutral Bo" :
                roll < 17 ? "Lícit Bo" :
                roll < 18 ? "Lícit Neutral" :
                Random.Array(["Caòtic Bo", "Caòtic Neutral"]);
    },

    ClassWeighted: function () {
        let rand = Random.Num(115);
        return rand < 7 ? "Bàrbar" :
            rand < 14 ? "Bard" :
                rand < 29 ? "Clergue" :
                    rand < 36 ? "Druida" :
                        rand < 52 ? "Guerrer" :
                            rand < 58 ? "Monjo" :
                                rand < 64 ? "Paladin" :
                                    rand < 70 ? "Ranger" :
                                        rand < 84 ? "Bergant" :
                                            rand < 89 ? "Bruixot" :
                                                rand < 94 ? "Mag Fosc" :
                                                    rand < 100 ? "Mag" :
                                                        rand < 105 ? (usedBooks.includes("EBR") ? "Artificer" : this.ClassWeighted()) :
                                                            rand < 110 ? (usedBooks.includes("Other") ? "Caçador de Sang" : this.ClassWeighted()) :
                                                                (usedBooks.includes("UA") ? "Místic" : this.ClassWeighted());
    },

    Status: function () {
        let roll = Random.DiceRoll("3d6");
        return roll < 4 ? "Mort (tira a la taula de Causa de la Mort)" :
            roll < 6 ? "Desaparegut o desconegut" :
                roll < 9 ? "Viu, però li va malament a causa d'una lesió, problemes financers o dificultats en les relacions" :
                    roll < 13 ? "Viu i bé" :
                        roll < 16 ? "Viu i amb força èxit" :
                            roll < 18 ? "Viu i amb mala fama" :
                                "Viu i famós";
    },

    RaisedBy: function () {
        let rand = Random.Num(100);
        return rand < 1 ? "Ningú" :
            rand < 2 ? "Institució, com un manicomi" :
                rand < 3 ? "Temple" :
                    rand < 5 ? "Orfenat" :
                        rand < 7 ? "Tutor" :
                            rand < 15 ? "Oncle o tia (patern/a o matern/a), o tots dos: o família extensa com una tribu o clan" :
                                rand < 25 ? "Avi/s (paterns o materns)" :
                                    rand < 35 ? "Família adoptiva (de la mateixa o diferent raça)" :
                                        rand < 55 ? "Pare solter o padrastre" :
                                            rand < 75 ? "Mare soltera o madrastra" :
                                                "Mare i pare";
    },

    AbsentParent: function () {
        let rand = Random.Num(4);
        return rand < 1 ? "Els teus pares van morir" :
            rand < 2 ? "Els teus pares van ser empresonats, esclavitzats o apartats d'alguna altra manera" :
                rand < 3 ? "Els teus pares et van abandonar" :
                    "Els teus pares van desaparèixer cap a un destí desconegut";
    },

    Lifestyle: function () {
        let roll = Random.DiceRoll("3d6");
        return roll < 4 ? ["Miserable", -40] :
            roll < 6 ? ["Escarransit", -20] :
                roll < 9 ? ["Pobre", -10] :
                    roll < 13 ? ["Modest", 0] :
                        roll < 16 ? ["Còmode", 10] :
                            roll < 18 ? ["Ric", 20] : ["Aristocràtic", 40];
    },

    Home: function (lifeMod) {
        let rand = Random.Num(100) + lifeMod;
        return rand < 0 ? "Al carrer" :
            rand < 20 ? "Cabana rònega" :
                rand < 30 ? "Sense residència permanent, et movies molt" :
                    rand < 40 ? "Campament o poble a la natura" :
                        rand < 50 ? "Apartament en un barri rònec" :
                            rand < 70 ? "Casa petita" :
                                rand < 90 ? "Casa gran" :
                                    rand < 110 ? "Mansió" :
                                        "Palau o Castell";
    },

    Memories: function () {
        let roll = Random.DiceRoll("3d6") + Random.Num(5) - 1;
        return roll < 4 ? "Encara estic traumatitzat per la meva infantesa, quan els meus companys em tractaven malament" :
            roll < 6 ? "Vaig passar la major part de la meva infantesa sol, sense amics íntims" :
                roll < 9 ? "Els altres em veien diferent o estrany, i per això tenia pocs companys" :
                    roll < 13 ? "Tenia alguns amics íntims i vaig tenir una infantesa corrent." :
                        roll < 16 ? "Tenia diversos amics, i la meva infantesa va ser generalment feliç." :
                            roll < 18 ? "Sempre em va resultar fàcil fer amics, i m'encantava estar amb gent." :
                                "Tothom sabia qui era, i tenia amics a tot arreu on anava.";
    },

    Relationship: function () {
        let roll = Random.DiceRoll("3d4");
        return roll < 5 ? "Hostil" :
            roll < 11 ? "Amistós" :
                "Indiferent";
    },
}

var LockFunctions = {
    TryLock: function (id) {
        let button = $("#" + id + "-lock-button").children(":first"),
            lockThis = !lock[id];
        lock[id] = lockThis;
        button.prop("class", lockThis ? "fa fa-lock" : "fa fa-lock-open");
    },
    TryLockAll: function (id) {
        lock.all.forEach(function (id) {
            lock[id] = true;
            $("#" + id + "-lock-button").children(":first").prop("class", "fa fa-lock");
        });
    },
    TryUnlockAll: function (id) {
        lock.all.forEach(function (id) {
            lock[id] = false;
            $("#" + id + "-lock-button").children(":first").prop("class", "fa fa-lock-open");
        });
    }
}

// When the page loads
$(function () {
    let calls = 9, generateNew = false;
    const GetJSON = function (name) {
        $.getJSON("js/JSON/" + name + ".json", function (data) {
            window[name] = data;
            calls--;
            if (calls <= 0) {
                CharacterType.GetNoCard();
                Dropdowns.Update();
                if (generateNew)
                    Generate.All();
                else {
                    Characters.LoadCharacter(character);
                    Characters.SaveCharacter();
                }
            }
        });
    }

    let savedData = localStorage.getItem("SavedCharacterData");
    if (savedData == undefined)
        generateNew = true;
    else
        character = JSON.parse(savedData);

    GetJSON("backgrounds");
    GetJSON("books");
    GetJSON("cardsources");
    GetJSON("classes");
    GetJSON("life");
    GetJSON("names");
    GetJSON("npcs");
    GetJSON("other");
    GetJSON("races");

    defaultRaceSectionClass = $("#race-section").prop("class");

    InitCardScript();
});

let Characters = {
    SaveCharacter: function () {
        prevCharacters.unshift(Object.assign({}, character));
        if (prevCharacters.length > 25)
            prevCharacters.pop();
        this.SetDropdown();
    },
    SaveToStorage: function () {
        localStorage.setItem("SavedCharacterData", JSON.stringify(character));
    },
    LoadCharacter: function (loadedCharacter) {
        character = Object.assign({}, loadedCharacter);
        Content.Get();
        CardType.Set();
        SetHTML();
        this.SaveToStorage();
    },
    SetDropdown: function () {
        if (prevCharacters.length < 2) return;
        let options = ["<option value=''>-Selecciona-</option>"];
        for (let index = 0; index < prevCharacters.length; index++) {
            let prevCharacter = prevCharacters[index];
            options.push("<option value='" + index + "'>" + prevCharacter.ShortName + ", " + prevCharacter.Race.name + " " + (prevCharacter.type == "npc" ? prevCharacter.Occupation : prevCharacter.Class.name) + "</option>");
        }
        $("#recent-characters-dropdown").html(options.join(""));
        $("#recent-characters").show();
    },
    LoadFromDropdown: function () {
        let num = $("#recent-characters-dropdown").val();
        if (num != "")
            this.LoadCharacter(prevCharacters[num]);
    }
}