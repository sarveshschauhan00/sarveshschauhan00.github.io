function CsvToHtmlTable(options) {

  var urlParams = new URLSearchParams(window.location.search);
  var gender = urlParams.get('gender');
  var category = urlParams.get('category');
  var mains_gen_rank = urlParams.get('mains_gen_rank');
  var mains_cat_rank = urlParams.get('mains_cat_rank');
  var adv_gen_rank = urlParams.get('adv_gen_rank');
  var adv_cat_rank = urlParams.get('adv_cat_rank');
  var year = urlParams.get('year');
  var margin = urlParams.get('margin');
  var low_margin = 1 - parseFloat(margin);
  var high_margin = 1 + parseFloat(margin);

  var container_iit = 'container_iit';
  var container_nit = 'container_nit';
  var container_iiit = 'container_iiit';
  var container_govt = 'container_govt';



  // console.log(options);

  var csv_path_iit = "data/" + year + "/iit.csv" || "";
  var csv_path_nit = "data/" + year + "/nit.csv" || "";
  var csv_path_iiit = "data/" + year + "/iiit.csv" || "";
  var csv_path_govt = "data/" + year + "/govt.csv" || "";
  
  var allow_download = options.allow_download || false;
  var csv_options = {
      separator: ',',
      delimiter: '"',
  } || {};
  var datatables_options = {paging: false} || {};
  var custom_formatting = options.custom_formatting || [];
  var customTemplates = {};

  $.each(custom_formatting, function (i, v) {
    var colIdx = v[0];
    var func = v[1];
    customTemplates[colIdx] = func;
  });

  var containers = [
    container_nit,
    container_iiit,
    container_govt
  ];
  var csv_paths = [
    csv_path_nit,
    csv_path_iiit,
    csv_path_govt
  ];

  if (adv_gen_rank>0 || adv_cat_rank>0) {
    let $table = $("<table class='table table-striped table-condensed' id='" + container_iit + "-table'></table>");
    let $containerElement = $("#" + container_iit);
    $containerElement.empty().append($table);

    $.when($.get(csv_path_iit)).then(
      function (data) {
        let csvData = $.csv.toArrays(data, csv_options);
        let $tableHead = $("<thead></thead>");
        let csvHeaderRow = csvData[0];
        let $tableHeadRow = $("<tr></tr>");
        for (let headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
            $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
        }
        $tableHead.append($tableHeadRow);
        $table.append($tableHead);
        let $tableBody = $("<tbody></tbody>");
        for (let rowIdx = 1; rowIdx < Math.floor(csvData.length); rowIdx++) {
          // console.log(csvData[rowIdx]);

          if (csvData[rowIdx][3] == category && csvData[rowIdx][3] != "OPEN") {
            if (adv_cat_rank >= (low_margin) * parseInt(csvData[rowIdx][5]) && adv_cat_rank <= (high_margin) * parseInt(csvData[rowIdx][6])) {
              if (gender == csvData[rowIdx][4] || csvData[rowIdx][4] == "Gender-Neutral" || csvData[rowIdx][4] == "NA") {
                let $tableBodyRow = $("<tr></tr>");
                for (let colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                  let $tableBodyRowTd = $("<td></td>");
                  let cellTemplateFunc = customTemplates[colIdx];
                  if (cellTemplateFunc) {
                    $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                  } else {
                    $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                  }
                  $tableBodyRow.append($tableBodyRowTd);
                  $tableBody.append($tableBodyRow);
                }
              }
            }
          }
          if (csvData[rowIdx][3] == "OPEN") {
            if (adv_gen_rank >= (low_margin) * parseInt(csvData[rowIdx][5]) && adv_gen_rank <= (high_margin) * parseInt(csvData[rowIdx][6])) {
              if (gender == csvData[rowIdx][4] || csvData[rowIdx][4] == "Gender-Neutral" || csvData[rowIdx][4] == "NA") {
                let $tableBodyRow = $("<tr></tr>");
                for (let colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                  let $tableBodyRowTd = $("<td></td>");
                  let cellTemplateFunc = customTemplates[colIdx];
                  if (cellTemplateFunc) {
                    $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                  } else {
                    $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                  }
                  $tableBodyRow.append($tableBodyRowTd);
                  $tableBody.append($tableBodyRow);
                }
              }
            }
          }
        };

        $table.append($tableBody);
        $table.DataTable(datatables_options);

      }
    ).fail(
      function () {
        console.log("Error loading CSV file");
      }
    );
  
  }

  if (mains_gen_rank>0 || mains_cat_rank>0) {
    for (let idx = 0; idx < csv_paths.length; idx++){
      let csv_file_path = csv_paths[idx];
      let container_id = containers[idx];

      let $table = $("<table class='table table-striped table-condensed' id='" + container_id + "-table'></table>");
      let $containerElement = $("#" + container_id);
      $containerElement.empty().append($table);

      $.when($.get(csv_file_path)).then(
        function (data) {
          let csvData = $.csv.toArrays(data, csv_options);
          let $tableHead = $("<thead></thead>");
          let csvHeaderRow = csvData[0];
          let $tableHeadRow = $("<tr></tr>");
          for (let headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
              $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
          }
          $tableHead.append($tableHeadRow);
          $table.append($tableHead);
          let $tableBody = $("<tbody></tbody>");
          for (let rowIdx = 1; rowIdx < Math.floor(csvData.length); rowIdx++) {
            // console.log(csvData[rowIdx]);
            if ( !(csvData[rowIdx][1].includes("Architecture")) && !(csvData[rowIdx][1].includes("Planning")) ) {
              if (csvData[rowIdx][3] == category && csvData[rowIdx][3] != "OPEN") {
                if (mains_cat_rank >= (low_margin) * parseInt(csvData[rowIdx][5]) && mains_cat_rank <= (high_margin) * parseInt(csvData[rowIdx][6])) {
                  if (gender == csvData[rowIdx][4] || csvData[rowIdx][4] == "Gender-Neutral" || csvData[rowIdx][4] == "NA") {
                    let $tableBodyRow = $("<tr></tr>");
                    for (let colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                      let $tableBodyRowTd = $("<td></td>");
                      let cellTemplateFunc = customTemplates[colIdx];
                      if (cellTemplateFunc) {
                        $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                      } else {
                        $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                      }
                      $tableBodyRow.append($tableBodyRowTd);
                      $tableBody.append($tableBodyRow);
                    }
                  }
                }
              }
              if (csvData[rowIdx][3] == "OPEN") {
                if (mains_gen_rank >= (low_margin) * parseInt(csvData[rowIdx][5]) && mains_gen_rank <= (high_margin) * parseInt(csvData[rowIdx][6])) {
                  if (gender == csvData[rowIdx][4] || csvData[rowIdx][4] == "Gender-Neutral" || csvData[rowIdx][4] == "NA") {
                    let $tableBodyRow = $("<tr></tr>");
                    for (let colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                      let $tableBodyRowTd = $("<td></td>");
                      let cellTemplateFunc = customTemplates[colIdx];
                      if (cellTemplateFunc) {
                        $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                      } else {
                        $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                      }
                      $tableBodyRow.append($tableBodyRowTd);
                      // console.log($tableBodyRow);
                      $tableBody.append($tableBodyRow);
                    }
                  }
                }
              }
            }
          };

          $table.append($tableBody);
          $table.DataTable(datatables_options);

        }
      ).fail(
        function () {
          console.log("Error loading CSV file");
        }
      );
    }
  }

}

function getValues(){
    var urlParams = new URLSearchParams(window.location.search);
    var gender = urlParams.get('gender');
    var category = urlParams.get('category');
    var mains_gen_rank = urlParams.get('mains_gen_rank');
    var mains_cat_rank = urlParams.get('mains_cat_rank');
    var adv_gen_rank = urlParams.get('adv_gen_rank');
    var adv_cat_rank = urlParams.get('adv_cat_rank');
    var year = urlParams.get('year');
    var margin = urlParams.get('margin');
    var container = document.getElementById('ranks');

    CsvToHtmlTable(
      {
        "gender" : gender,
        "category" : category,
        "mains_gen_rank" : mains_gen_rank,
        "mains_cat_rank" : mains_cat_rank,
        "adv_gen_rank" : adv_gen_rank,
        "adv_cat_rank" : adv_cat_rank,
        "year" : year,
        "margin" : margin
      }
    )


    var ul = document.createElement('ul');
    container.appendChild(ul);
    
    var liGender = document.createElement('li');
    liGender.textContent = 'Gender: ' + gender;
    ul.appendChild(liGender);
    
    var liCategory = document.createElement('li');
    liCategory.textContent = 'Category: ' + category;
    ul.appendChild(liCategory);
    
    var liMainsGenRank = document.createElement('li');
    liMainsGenRank.textContent = 'Mains General Rank: ' + mains_gen_rank;
    ul.appendChild(liMainsGenRank);
    
    var liMainsCatRank = document.createElement('li');
    liMainsCatRank.textContent = 'Mains Category Rank: ' + mains_cat_rank;
    ul.appendChild(liMainsCatRank);
    
    var liAdvGenRank = document.createElement('li');
    liAdvGenRank.textContent = 'Advanced General Rank: ' + adv_gen_rank;
    ul.appendChild(liAdvGenRank);
    
    var liAdvCatRank = document.createElement('li');
    liAdvCatRank.textContent = 'Advanced Category Rank: ' + adv_cat_rank;
    ul.appendChild(liAdvCatRank);
    
    var liYear = document.createElement('li');
    liYear.textContent = 'Year: ' + year;
    ul.appendChild(liYear);
    
    var liMargin = document.createElement('li');
    liMargin.textContent = 'Opening and Closing Rank Margin: ' + margin*100 + "%";
    ul.appendChild(liMargin);

    var gender_new = "Male";
    if (gender == "Female-only (including Supernumerary)"){
      gender_new = "Female";
    }

    $('#ranks').empty().append('<ul>' + "<li style='color:red;'><strong>Gender: <span style='color:black;'>"+ gender_new +"</span></strong></li>" + "<li style='color:red;'><strong>Year: <span style='color:black;'>"+ year +"</span></strong></li>" + "<li style='color:red;'><strong>Category: <span style='color:black;'>"+ category +"</span></strong></li>" + "<li style='color:red;'><strong>Mains General Rank: <span style='color:black;'>"+ mains_gen_rank +"</span></strong></li>" + "<li style='color:red;'><strong>Mains Category Rank: <span style='color:black;'>"+ mains_cat_rank +"</span></strong></li>" + "<li style='color:red;'><strong>Advanced General Rank: <span style='color:black;'>"+ adv_gen_rank +"</span></strong></li>" + "<li style='color:red;'><strong>Advanced Category Rank: <span style='color:black;'>"+ adv_cat_rank +"</span></strong></li>" + '</ul>');
    
  }






