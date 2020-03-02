
var lncrna = [];

$( document ).ready(function() {
    
    diasableLinks();
    
    var lnc = getUrlParam("lnc", "");
    
    if(lnc != null){
        
        enableLinks();
        
        $("#lncinfo").html("<h1>"+lnc+"</h1><div id=\"pathway_pred\"></div><hr><div id=\"phenotype_pred\"></div><hr><div id=\"process_pred\"></div><hr><div id=\"gene_pred\"></div>");
        
        data1 = {"lnc": lnc, "domain": "pathway"}
        $.getJSON('api/lnc', data1, function(result1) {
            var table = createTable("pathway_table", result1);
            $("#pathway_pred").html();
            $("#pathway_pred").append(table);
            var table1 = $('#pathway_table').DataTable();
        });
        
        data2 = {"lnc": lnc, "domain": "phenotype"}
        $.getJSON('api/lnc', data2, function(result2) {
            var table = createTable("phenotype_table", result2);
            $("#phenotype_pred").html("");
            $("#phenotype_pred").append(table);
            var table2 = $('#phenotype_table').DataTable();
        });
        
        data3 = {"lnc": lnc, "domain": "process"}
        $.getJSON('api/lnc', data3, function(result3) {
            var table = createTable("process_table", result3);
            $("#process_pred").html("");
            $("#process_pred").append(table);
            var table3 = $('#process_table').DataTable();
        });
        
        data4 = {"lnc": lnc, "domain": "gene"}
        $.getJSON('api/lnc', data4, function(result4) {
            var table = createTable("gene_table", result4);
            $("#gene_pred").html("");
            $("#gene_pred").append(table);
            var table4 = $('#gene_table').DataTable();
        });
    }
    
    $.getJSON('api/listlnc', function(lnc) {
        lncrna = lnc
        $( "#autolnc" ).autocomplete({
          source: lncrna
        });
    });
    
    $('a[href*="#"]').on('click', function(e) {
      e.preventDefault()
      $('html, body').animate(
        {
          scrollTop: $($(this).attr('href')).offset().top,
        },
        500,
        'linear'
      )
    });
    
    $("#autolnc").bind("enterKey",function(e){
        searchlnc();
    });
    $("#autolnc").keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });
});


function createTable(table_id, result){
    var domain = result["domain"];
    var lnc = result["lnc"];
    var attributes = result["attributes"];
    var scores = result["association_score"];
    var domainname = domain.charAt(0).toUpperCase() + domain.substring(1);;
    
    var tableInfo = "<table id=\""+table_id+"\"><thead><tr><th>Rank</th><th>"+domainname+"</th><th>z-score</th></tr></thead><tbody>";
    
    for(i=0; i<attributes.length; i++){
        tableInfo = tableInfo + "<tr><td class=\"table_ranks\">"+(i+1)+"</td><td class=\"table_attributes\">"+attributes[i]+"</td><td class=\"table_scores\">"+scores[i].toFixed(2)+"</td></tr>";
    }
    
    tableInfo += "</tbody></table>";
    
    if(domain == "gene"){
        domainname = "Top 500 Co-Expressed Genes";
    }
    else if(domain == "pathway"){
        domainname = "KEGG Pathway Membership Predictions";
    }
    else if(domain == "phenotype"){
        domainname = "Mouse Phenotypes Predictions";
    }
    else if(domain == "process"){
        domainname = "Gene Ontology Biological Processes Predictions";
    }
    
    finContent = "<h3>"+domainname+"</h3>"+tableInfo;
    return finContent;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function searchlnc(){
    window.open("?lnc="+$("#autolnc").val(),"_self")
}

function showdownloads(){
    diasableLinks();
    var downloadtext = "<h1>Downloads</h1> These are the files used to calculate the predictions and the complete assiciation tables for all lncRNAs.";
    downloadtext += "<h4>lncRNA-gene co-expression similarity (recount2)</h4><a href=\"https://mssm-lnchub.s3.amazonaws.com/lnc_similarity.tsv\">lnc_similarity.tsv</a> | 786.2 MB<br>";
    downloadtext += "<h4>Kyoto Encyclopedia of Genes and Genomes (KEGG) pathways</h4><a href=\"https://mssm-lnchub.s3.amazonaws.com/lnc_pathway.tsv\">lnc_pathway.tsv</a> | 12.3 MB<br>";
    downloadtext += "<h4>Mammalian Phenotypes from Interenational Mouse Phenotyping Consortium (IMPC)</h4><a href=\"https://mssm-lnchub.s3.amazonaws.com/lnc_phenotype.tsv\">lnc_phenotype.tsv</a> | 204.5 MB<br>";
    downloadtext += "<h4>Gene Ontology Biological Processes (GO:BP)</h4><a href=\"https://mssm-lnchub.s3.amazonaws.com/lnc_process.tsv\">lnc_process.tsv</a> | 208.5 MB<br>";
    $("#lncinfo").html("");
    $("#lncinfo").append(downloadtext);
}

function home(){
    diasableLinks();
    var text = "<h1>lncHUB: Functional predictions of human long non-coding RNAs based on gene co-expression data</h1><div>long non-coding RNAs (lncRNAs) are defined as RNA transcripts of length exceeding 200 nucleotides that are not translated into protein. While it is estimated that there are over 15,000 lncRNAs encoded in the human genome, whereby many of them serve important function, knowledge about their role in the cell and their association with normal physiology and human disease is mostly unknown. lncHUB provides predictions for such associations based on data from mRNA co-expression.<br><h3>Instructions:</h3>Select a long non-coding RNA from the search box and submit it to see ranked predictions of its putative functions. lncHUB also lists the top correlated genes based gene expression for each submitted lncRNA.</div>";
    $("#lncinfo").html("");
    $("#lncinfo").append(text);
}

function diasableLinks(){
    $("#prlnc").hide();
    $("#palnc").hide();
    $("#phlnc").hide();
    $("#glnc").hide();
}

function enableLinks(){
    $("#prlnc").show();
    $("#palnc").show();
    $("#phlnc").show();
    $("#glnc").show();
}


