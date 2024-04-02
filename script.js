const fileInput = document.querySelector(".file-input"),
      filterOptions = document.querySelectorAll(".filter button"),
      filterName = document.querySelector(".filter-info .name"),
      filterValue = document.querySelector(".filter-info .value"),
      filterSlider = document.querySelector(".slider input"),
      rotateOptions = document.querySelectorAll(".rotate button"),
      previewImg = document.querySelector(".preview-img img"),
      resetFilterBtn = document.querySelector(".reset-filter"),
      chooseImgBtn = document.querySelector(".choose-img"),
      saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilters(); 
        document.querySelector(".container").classList.remove("disable");
    });
};

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter button.active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        switch (option.id) {
            case "brightness":
                filterSlider.max = "200";
                filterSlider.value = brightness;
                filterValue.innerText = `${brightness}%`;
                break;
            case "saturation":
                filterSlider.max = "200";
                filterSlider.value = saturation;
                filterValue.innerText = `${saturation}%`;
                break;
            case "inversion":
                filterSlider.max = "100";
                filterSlider.value = inversion;
                filterValue.innerText = `${inversion}%`;
                break;
            case "grayscale":
                filterSlider.max = "100";
                filterSlider.value = grayscale;
                filterValue.innerText = `${grayscale}%`;
                break;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter button.active");
    switch (selectedFilter.id) {
        case "brightness":
            brightness = filterSlider.value;
            break;
        case "saturation":
            saturation = filterSlider.value;
            break;
        case "inversion":
            inversion = filterSlider.value;
            break;
        case "grayscale":
            grayscale = filterSlider.value;
            break;
    }
    applyFilter();
};

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal *= -1;
        } else if (option.id === "vertical") {
            flipVertical *= -1;
        }
        applyFilter();
    });
});

const resetFilters = () => {
    brightness = "100";
    saturation = "100";
    inversion = "0";
    grayscale = "0";
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
};

resetFilterBtn.addEventListener("click", () => {
    document.getElementById('resetSound').play();
    setTimeout(() => {
        resetFilters(); 
    }, 100);
});

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "edited-image.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
};

filterSlider.addEventListener('input', function() {
    const value = (this.value-this.min)/(this.max-this.min)*100;
    this.style.setProperty('--range-value', `${value}%`);
    updateFilter();
  });
  
fileInput.addEventListener("change", loadImage);

chooseImgBtn.addEventListener("click", () => {
    document.getElementById('chooseSound').play();
    setTimeout(() => {
        fileInput.click(); 
    }, 100);
});

saveImgBtn.addEventListener("click", () => {
    document.getElementById('saveSound').play();
    setTimeout(() => {
        saveImage(); 
    }, 100);
});
