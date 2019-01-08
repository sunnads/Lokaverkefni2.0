//////////////////////////////////////////////////////////
//                                                      //
//  Höfundur: Sunna Dröfn Sigfúsdóttir                  //
//  Útgáfudagur: 9.1.2019                               //
//  BSc verkefni í Tölvunarfræði við Háskóla Íslands    //
//  Leiðbeinandi: Ebba Þóra Hvannberg                   //
//                                                      //
//////////////////////////////////////////////////////////

var valKassar = $("#checkedBoxes");
var vali = [];
var spila = false;
var stig;
var spilad;
var timi;
var rettSvar;
var blandasp;

//Það sem gerist eftir að það er ýtt á spila takkan á leikur
$("#veljaTakki").click(function () {
    //Nær í kassana sem var búið að haka í
    valKassar.find("input[name='checkbox']:checked").each(function () {
        vali.push(this.value);
    })
    //athugar hvor að það sé búið að haka í einhvern af kössunum, ef svo er byrjar leikurinn, ef ekki er birt overleyið (villuskilaboðin)
    if (vali.length !== 0) {
       //ef búið er að haka í stæ aðferð, er Page1 faling og við birtum Page2 (eða spila síðuna)
        fela("Page1");
        birta("Page2");
    }
    else {
        //overlayið birt ef ekki var valið stæ aðferð
        overlay();
        return;
    }
})


//Það sem gerist þegar ýtt er á "Byrja að spila" (veljaTakki) takkann
document.getElementById("veljaTakki").onclick = function(){
        spila = true;

        //stigin núllstillt og birt
        stig = 0;
        document.getElementById("stigGildi").innerHTML = stig;

        //birtir tímann og segir hversu langur hann er
        birta("timi");
        timi = 120;
        document.getElementById("timiGildi").innerHTML = timi;

        //felur leik lokið kassann
        fela("leikLokid");

        //breytir takkanum og segir hvað er gert ef það er ýtt á hann
        document.getElementById("spilaTakki").innerHTML = "Spila aftur";
        $("#spilaTakki").click(function () {
            location.reload();
        })

        //byrjar að telja niður
        byrjaTima();

        //nær í spurningu
        spurning();
}


//það sem gerist þegar það er ýtt á svarkassana
for(i=1; i<5; i++){
    document.getElementById("box"+i).onclick = function(){

        //byrjar á að athuga hvort að það sé verið að spila
        if(spila == true){
            //ef það er verið að spila athugar það hvort þú hafir ýtt á rétt svar
            if(this.innerHTML == rettSvar){

                //ef þetta var rétt svar hækka stigin um 1
                stig++;

                //sýnt að stigið hækki um 1
                document.getElementById("stigGildi").innerHTML = stig;

                //ef svarið var rétt birta borðan sem segir að svarið hafi verið rétt og felur borðann fyrir rangt svar
                fela("rangt");
                birta("rett");

                // borðin sýndur í 1 sec
                setTimeout(function(){
                    fela("rett");
                }, 1000);

                //nær í nýja spurningu
                spurning();

            }else{
                //ef svarið var rangt, birta rangt borðann og fela rétt borðann
                fela("rett");
                birta("rangt");

                //borðinn sýndur í 1 sec
                setTimeout(function(){
                    fela("rangt");
                }, 1000);
            }
        }
    }
}

//fall til að setja tímann í leiknum af stað og bita leik lokið
function byrjaTima(){
    spilad = setInterval(function(){
        timi -= 1;
        document.getElementById("timiGildi").innerHTML = timi;

        //það sem fer í gang þegar að tíminn er búin
        if(timi ==0){

            //tíminn stoppaður
            stodvaTima();

            //leik lokið glugginn birtur og segir hversu mörgum dæmum þú náðari að svara rétt
            birta("leikLokid");
            document.getElementById("leikLokid").innerHTML =
                "<p>Leik lokið</p> <p>Þú svaraðir " + stig + " spurningum rétt</p>";

            //hlutir faldir að leik loknum
            fela("timi");
            fela("rett");
            fela("rangt");
            spila = false;

            //þegar ýtt er á spilaTakki, er síðunni reloadað
            document.getElementById("spilaTakki").innerHTML = "Spila aftur";
            $("#spilaTakki").click(function () {
                location.reload();
            })
        }
    }, 1000);
}


//fall til að stoppa tímann
function stodvaTima(){
    clearInterval(spilad);
}

//fall til að fela hluti
function fela(Id){
    document.getElementById(Id).style.display = "none";
}

//fall til að birta hluti
function birta(Id){
    document.getElementById(Id).style.display = "block";
}

//byr til spurningarnar og svörin
function spurning(){

    //fall sem tekur það sem var hakað í og margfaldar það við Marh.random til að fá spurningar úr öllum völdum aðgerðum
    var valid = function(){
        var blandasp = Math.floor(Math.random() * vali.length);
        return vali[blandasp];
    }
    var valid = valid();

        //ef plús er valið
        if (vali == "+"){
            //sett random gildi á x og y
            var x = Math.floor(Math.random() * 10 + 1);
            var y = Math.floor(Math.random() * 10 + 1);
            //búin til gildi fyrir rétt svar
            rettSvar = x + y;

            //spurningin birt
            document.getElementById("spurningar").innerHTML = x + "+" + y;

            //valin random staðsetning fyrir rétta svarið til að fara á
            var rettStads = Math.floor(Math.random() * 3 + 1);

            //rétt svar birt í kassann sem var valin að ofan
            document.getElementById("box" + rettStads).innerHTML = rettSvar;
            var answers = [rettSvar];

            //if lykkja til að finna inn rangt svar í hina kassana
            for(i=1; i<5; i++){
                //athugar hvort að retta svarið sé núþegar komið í kassann og ef svo er ekki heldur áfam í gegn
                if(i !== rettStads) {
                    var vitlaust;
                    //byr til vitlaust svar til að setja í kassana
                    do{
                        vitlaust = (Math.floor(Math.random() * 10 + 1))+(Math.floor(Math.random() * 10 + 1));
                    }
                    while(answers.indexOf(vitlaust)>-1)
                    //nær í vitlaust svar og setur inn í kassana þangað til að þeir eru allir fullir
                        document.getElementById("box"+i).innerHTML = vitlaust;
                        answers.push(vitlaust);
                }
            }
            //ef mínus er valið
        } else if (valid == "-"){
            var x = Math.floor(Math.random() * 10 + 1);
            var y = Math.floor(Math.random() * 10 + 1);
            rettSvar = x - y;

            document.getElementById("spurningar").innerHTML = x + "&#8722;" + y;
            var rettStads = Math.floor(Math.random() * 3 + 1);
            document.getElementById("box" + rettStads).innerHTML = rettSvar;
            var answers = [rettSvar];

            for(i=1; i<5; i++){
                if(i !== rettStads) {
                    var vitlaust;
                    do{
                        vitlaust = (Math.floor(Math.random() * 10 + 1))-(Math.floor(Math.random() * 10 + 1));
                    }
                    while(answers.indexOf(vitlaust)>-1)
                        document.getElementById("box"+i).innerHTML = vitlaust;
                        answers.push(vitlaust);
                }
            }
            //ef margföldun er valin
        } else if (valid == "*"){
            var x = Math.floor(Math.random() * 10 + 1);
            var y = Math.floor(Math.random() * 10 + 1);
            rettSvar = x * y;

            document.getElementById("spurningar").innerHTML = x + "&#215;" + y;
            var rettStads = Math.floor(Math.random() * 3 + 1);
            document.getElementById("box" + rettStads).innerHTML = rettSvar;
            var answers = [rettSvar];

            for(i=1; i<5; i++){
                if(i !== rettStads) {
                    var vitlaust;
                    do{
                        vitlaust = (Math.floor(Math.random() * 10 + 1))*(Math.floor(Math.random() * 10 + 1)); //a wrong answer
                    }
                    while(answers.indexOf(vitlaust)>-1)
                        document.getElementById("box"+i).innerHTML = vitlaust;
                        answers.push(vitlaust);
                }
            }

            //ef deiling er valin
        } else if (valid == "/") {
            while (heiltala !== Math.floor(heiltala) || heiltala === 1){
                var x = Math.floor(Math.random() * 10 + 1);
                var y = Math.floor(Math.random() * 10 + 1);
                var heiltala = x / y;
            }
            document.getElementById("spurningar").innerHTML = x + "&#247;" + y;
            var rettStads = Math.floor(Math.random() * 3 + 1);
            document.getElementById("box" + rettStads).innerHTML = heiltala;
            rettSvar = heiltala;
            var answers = [heiltala];

            for(i=1; i<5; i++){
                if(i !== rettStads) {
                    var vitlaust;
                    do{
                        vitlaust = (Math.floor(Math.random() * 10 + 1))*(Math.floor(Math.random() * 10 + 1)); //a wrong answer
                    }
                    while(answers.indexOf(vitlaust)>-1)
                        document.getElementById("box"+i).innerHTML = vitlaust;
                        answers.push(vitlaust);
                }
            }
        }
}