function updateFromIri(iri) {
  $( document ).trigger( 'updateFromIri', iri );
}

function sparql(queryAsList, iri, callback) {
    var q = _PREAMBLE.concat(queryAsList).join("\n").replace(/--IRI--/g, iri);
    $.ajax({
      url: _FUSEKI_URLS[$(location).attr('protocol')],
      data: {
        "query" : q},
      dataType: 'json',
      success: callback,
      timeout: 2500,
      error: _errorCallback,
    });
}

function _errorCallback() {
    $( "#myAjaxAlert" ).removeClass( "hide" );
}

var _FUSEKI_URLS = {
    "http:" : "http://seweb.abdn.ac.uk/fuseki/ds/query", 
    "file:" : "http://seweb.abdn.ac.uk/fuseki/ds/query"//"http://localhost:3030/ds/query"
};

var fuseki = function(template_key, iri) { console.log("Error - not initialized"); };

function initFuseki() {
  fuseki = function(template_key, iri) {
    fusekiCall(
        _FUSEKI_URLS[$(location).attr('protocol')],
        template_key, 
        iri,
        function () { 
          console.log( "No response to " + template_key + " query for " + iri );
          $( "#myAjaxAlert" ).removeClass( "hide" );
        });
  };
}

function fusekiCall(fusekiUrl, template_key, iri, errorCallback) {
  var q = $( "body" ).data( "sparql-" + template_key).query.replace(/--IRI--/g, iri);
  $.ajax({
    url: fusekiUrl,
    data: {
      "query" : q},
    dataType: 'json',
    success: $( "body" ).data( "sparql-" + template_key).callback,
    timeout: 2500,
    error: errorCallback,
  });
}

function register(templateName, lines, callback) {
  $( "body" ).data( "sparql-" + templateName, {"query": _PREAMBLE.concat(lines).join("\n"), "callback": callback});
}

$( document ).ready( function() {
  initFuseki();
  register_all_sparql_queries();
});

function _valuesOfSparqlBinding( sparqlBinding ) {
  var result = {};
  for (key in sparqlBinding) {
    result[key] = sparqlBinding[key].value;
  }
  return result;
}

function _set_html_from_dbpedia_description(selector, search_for) {
  $.ajax({
    url: "http://lookup.dbpedia.org/api/search/KeywordSearch",
    data: {
      "QueryString" : search_for,
      "MaxHits" : 1,},
    dataType: 'json',
    success: function( response ) {
      if ( response.results[0] ) {
        $( selector ).html(response.results[0].description + " <i>[Source: Wikipedia]</i>");
      };
    },
    timeout: 2500,
  });
}

_PREAMBLE = [
             "BASE <http://dot.rural/sepake/>",
             "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>",
             "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
             "PREFIX prov: <http://www.w3.org/ns/prov#>",
             "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
             ];

function register_all_sparql_queries() {
}
