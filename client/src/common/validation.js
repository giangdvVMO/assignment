export const checkMail = (mail) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(mail)
}

export const checkPhone = (phone) => {
    const regex = /^0[1-9][0-9]{8,9}$/;
    return regex.test(phone)
}

export const checkUsername = (username) => {
    const regex = /^\w{2,50}$/;
    return regex.test(username);
}

export const checkPassword = (password) => {
    if (password.length < 6) {
        return false;
    }
    return true;
}

export const checkRole = (role) => {
    if (role === '') {
        return false;
    }
    return true;
}

export const checkFullName = (fullname) => {
    if (fullname.length === 0 || fullname.length > 50) {
        return false;
    }
    return true;
}

export const checkReason = (reason)=>{
    if(!reason|| reason.length>50){
        return false
    }
    const regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s()\/\.\,\+]{1,50}$/
    console.log("test",regex.test(reason));
    return regex.test(reason)
}

export const checkBirthday = (birthday) => {
    const now = new Date();
    const year = new Date(birthday).getFullYear();
    const month = new Date(birthday).getMonth();
    const day = new Date(birthday).getDate();
    let age = now.getFullYear() - year;
    if (now.getMonth() > month || (now.getMonth() === month && now.getDate() > day)) {
        age = age - 1;
    }
    if (age < 18) {
        return false;
    }
    return true;
}

export const checkConfirmPass = (password, confirm) => {
    return (confirm === password);
}

export const checkUniversity = (university) => {
    return university!=='';
}

export const checkFaculty = (faculty) => {
    return faculty!=='';
}

export const checkCourse = (course) => {
    const value = course.split('-');
    try{
        if(value.length<2||!+value[0]||!+value[1]){
            return false;
        }
    }catch{
        return false;
    }
    return true;
}

export const checkCCCD = (cccd) => {
    const regexCMT = /^0[0-9]{8}$/;
    const regexCC = /^0[0-9]{11}$/;
    if(!cccd||(cccd.length!==9&&cccd.length!==12)||(!regexCMT.test(cccd)&&!regexCC.test(cccd))){
        return false;
    }
    return true;
}

export const checkAddress = (address) => {
    return address!=='';
}

export const checkCardStudent = (cardStudent) => {
    return cardStudent!=='';
}

export const checkMajor = (major) => {
    return major!=='';
}

export const checkGPA = (gpa) => {
   // console.log('gpa', parseFloat(gpa) );
    if(!gpa||!parseFloat(gpa)||parseFloat(gpa)<0||parseFloat(gpa)>4){
        return false;
    }
    return true;
}

export const checkComName = (name) =>{
    if(!name||name.length>50){
        return false;
    }
    return true
}

export const checkWebsite = (name) =>{
    if(!name||name.length>50){
        return false;
    }
    return true
}
export const checkYear = (year) =>{
    const now = new Date().getFullYear();
    if(!year||!+year||+year>now||+year<(now-200)){
        return false;
    }
    return true
}
export const checkScale = (scale) =>{
    if(!scale||!+scale||+scale<0){
        return false;
    }
    return true
}
export const checkManufacture = (manu)=>{
    if(!manu.length){
        return false;
    }
    return true;
}

export const checkString = (data)=>{
    return data;
}

export const checkNumber = (data)=>{
   // console.log("data",data);
    if(data === 0) return true;
    return +data;
}

export const checkDate = (data)=>{
    try{
        if(data===''){
            return false
        }
        const date = new Date(data);
        return true;
    }catch{
        return false;
    }
}

export const checkArray = (data)=>{
   // console.log("data",data)
    return data.length;
}

export const checkFileCV = (data)=>{
    if(!data){
        return false;
    }
   const extentions = data.split('.');
   const extention = extentions[extentions.length-1];
   const condition = data&&(data.includes('png')||data.includes('img')||data.includes('jpeg')||data.includes('pdf'));
   console.log('condition', condition) 
   if(condition){
        return true;
    }
    return false;
    // return data.length;
}


export const checkTitle = (title) => {
    const regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s()\/\.\,\+]{1,50}$/
    return regex.test(title)
}

export const checkContent = (content) => {
    const regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\/\,\n\.()\:\+\;]{1,}$/
    return regex.test(content)
}

export const checkSpecial = (content, length)=>{
    let regex;
    if(length===1000){
        regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\/\,\-\n\t\.()\:\+\;]{1,1000}$/
    }
    if(length===50){
        regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9\s\/\,\-\.()\:\+\;]{1,50}$/
    }
    console.log(regex.test(content));
    return regex.test(content)
}