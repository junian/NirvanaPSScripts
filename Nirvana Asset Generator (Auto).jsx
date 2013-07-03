//app.activeDocument.duplicate("coba");
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;
app.displayDialogs = DialogModes.NO

var DEBUG = false;
var AUTO_CLOSE = true;

var sp = "sp";
var fp = "fp"
var charaNameInJapan = "";
var maxLevel = 4;
var levelNames = ["", "+", "++", "+3", "+4"];
var levelFolderNames = ["normal", "+", "++", "+3", "+4"];
var filePostfix = ["_l", "_m", "_s_on", "_body"];
var fileSpSize = [
    ["480 px", "600 px"],
    ["320 px", "400 px"],
    ["200 px", "250 px"],
    ["144 px", "180 px"]
];
var layerLevelNames = ["normal", "+", "++", "+3", "+4"];
var fileSizeLimit = new Array();
var activeDoc = app.activeDocument;

fileSizeLimit["sp"] = new Array();
fileSizeLimit["fp"] = new Array();

fileSizeLimit["sp"]["_body"] = sizeInKB(10);
fileSizeLimit["sp"]["_face"] = sizeInKB(5);
fileSizeLimit["sp"]["_friend"] = sizeInKB(20);
fileSizeLimit["sp"]["_l"] = sizeInKB(50);
fileSizeLimit["sp"]["_m"] = sizeInKB(40);
fileSizeLimit["sp"]["_my"] = sizeInKB(10);
fileSizeLimit["sp"]["_s_on"] = sizeInKB(20);

fileSizeLimit["fp"]["_body"] = sizeInKB(3);
fileSizeLimit["fp"]["_face"] = sizeInKB(1.5);
fileSizeLimit["fp"]["_friend"] = sizeInKB(6);
fileSizeLimit["fp"]["_l"] = sizeInKB(20);
fileSizeLimit["fp"]["_m"] = sizeInKB(10);
fileSizeLimit["fp"]["_my"] = sizeInKB(3);
fileSizeLimit["fp"]["_s_on"] = sizeInKB(5);

var welcomeStr = "Welcome to the Nirvana Asset Generator\nProudly presented by junian@square-enix-smileworks.com\n";

charaNameInJapan = prompt(welcomeStr + "\nNama karakter dalam font jepang?", activeDoc.name);
var lvlStr = prompt("Berapakah Level Maksimal Kartu ini?", 4);
maxLevel = Math.max(1, Math.min(4, parseInt(lvlStr)));

//var rootPath = app.activeDocument.path + "/" + charaNameInJapan;
var rootPath = Folder.myDocuments + "/" + charaNameInJapan;
//confirm(rootPath);
generateFolders();
generateNirvanaAsset();

function sizeInKB(n) {
    return n * 1024;
}

function generateFolders() {
    var folder = new Folder(rootPath);
    createFolder(folder);
    for (var a = 0; a <= maxLevel; a++) {
        folder = new Folder(rootPath + "/" + levelFolderNames[a]);
        createFolder(folder);
        folder.changePath(sp);
        createFolder(folder);
        folder.changePath("../" + fp);
        createFolder(folder);
    }
}

function createFolder(dir) {
    if (!dir.exists) {
        dir.create();
    }
}

function generateNirvanaAsset() {
    //var docs = new Array();
    var doc = activeDoc.duplicate(charaNameInJapan);
    var doch = Math.floor(doc.height.as("px"));
    var docw = Math.floor(doc.width.as("px"));
    var aboutFile = "Nama karakter: " + charaNameInJapan + "\nMax Level: " + maxLevel + "\n";
    //confirm(doch + ", " + docw);
    //confirm(doc.width + " " + doc.height + "apa???? " + (doc.height == "280 px"));
    if (docw == 100.0 && doch == 100.0) {
        if (!confirm(aboutFile + "Apakah ini adalah kartu _face?"))
            return;
        generateSpFpImages(doc, "_face");
    } else if (docw == 480.0 && doch == 120.0) {
        if (!confirm(aboutFile + "Apakah ini kartu _friend?"))
            return;
        generateSpFpImages(doc, "_friend");
    } else if (docw == 90.0 && doch == 280.0) {
        if (!confirm(aboutFile + "Apakah ini kartu _my?"))
            return;
        generateSpFpImages(doc, "_my");
    } else {
        if (!confirm(aboutFile + "Apakah ini kartu _l, _m, _s_on, dan _body?"))
            return;
        if(AUTO_CLOSE)
        {
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }
        for (var a = 0; a < filePostfix.length; a++) {
            doc = activeDoc.duplicate(charaNameInJapan);
            doc.resizeImage(fileSpSize[a][0], fileSpSize[a][1], doc.resolution, ResampleMethod.BICUBIC);
            //docs[a] = doc;
            generateSpFpImages(doc, filePostfix[a]);
        }
    }

    alert("File berhasil di-generate di:\n" + rootPath);
}

function preGeneratedJpegs(postfix)
{
    for (var i = 0; i <= maxLevel; i++) {
        for (var j = 0; j < layerLevelNames.length; j++) {
            try {
                var layer = activeDoc.artLayers.getByName(layerLevelNames[j]);
                if (i == j)
                    layer.visible = true;
                else
                    layer.visible = false;
            } catch (e) {
                // confirm(layerLevelNames[j]);
                //do nothing
            }
        }

        //confirm(saveFile.length);
        var savePath = rootPath + "/" + levelFolderNames[i] + "/" + sp + "/" + charaNameInJapan + levelNames[i] + postfix + ".jpg";
        saveJpeg(activeDoc, savePath, 100);
        var savePath = rootPath + "/" + levelFolderNames[i] + "/" + fp + "/" + charaNameInJapan + levelNames[i] + postfix + ".jpg";
        saveJpeg(activeDoc, savePath, 100);
    }
}

function generateSpFpImages(doc, postfix) {
    app.activeDocument = activeDoc;
    preGeneratedJpegs(postfix);
    app.activeDocument = doc;
    generateJpegs(doc, sp, postfix);
    doc.resizeImage("50 %", "50 %", doc.resolution, ResampleMethod.BICUBIC);
    generateJpegs(doc, fp, postfix);
    if(AUTO_CLOSE)
    {
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

function generateJpegs(doc, typesize, postfix) {
    for (var i = 0; i <= maxLevel; i++) {
        //confirm(saveFile.length);
        var savePath = rootPath + "/" + levelFolderNames[i] + "/" + typesize + "/" + charaNameInJapan + levelNames[i] + postfix + ".jpg";
        var jpegDoc = open(File(savePath));
        //if(DEBUG)
            //alert(doc.width + ", " + doc.height);
        jpegDoc.resizeImage(doc.width, doc.height, jpegDoc.resolution, ResampleMethod.BICUBIC);
        saveAsJpeg(
            jpegDoc,
            savePath,
            fileSizeLimit[typesize][postfix],
            typesize);
        jpegDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

function saveAsJpeg(doc, filePath, limitSize, typesize) {
    var min = 1;
    var max = 100;
    var mid = Math.floor((max+min)/2);
    //alert(limitSize);
    var i = 1;
    for(i=1;i<=100;i++)
    {
        var f = saveJpeg(doc, filePath, i);
        if(f.length > limitSize)
        {
            f = saveJpeg(doc, filePath, i-1);
            if(f.length < bottomLimit(limitSize) && typesize == sp)
            {
                if(DEBUG)
                {
                    alert("SP nih");
                }
                f = saveJpeg(doc, filePath, i);
            }
            if(DEBUG)
            {
                alert(f.length + ", " + limitSize + ", " + bottomLimit(limitSize));
            }
            break;
        }
    }
}

function bottomLimit(limitSize)
{
    if(limitSize <= sizeInKB(5))
    {
        return limitSize - sizeInKB(0.3);
    }
    return limitSize - sizeInKB(0.5);
}

function saveJpeg(doc, filePath, quality){
    var options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType.JPEG;
    options.optimized = true;
    options.interlaced = false;
    options.quality = quality;
    options.blur = 0.0;

    options.includeProfile = false;
    var saveFile = new File(filePath);
    doc.exportDocument(
        saveFile,
        ExportType.SAVEFORWEB,
        options);
    return saveFile;
}
