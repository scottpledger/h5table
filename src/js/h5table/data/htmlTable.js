define([
  'jquery',
  './base',
  '../utils',
  '../types/table',
  '../types/column',
  '../types/row'
], function ($, BaseAdapter, Utils, Table, Column, Row) {

  function HtmlTableAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    if(!this.options.get('tableClass'))
      this.options.set('tableClass',this.$element.attr('class'));

    this.$head = $element.find('thead');
    this.$body = $element.find('tbody');

    this._cache = {};
    // we ignore the footer.

    console.log('HtmlTableAdapter::self', this);

    this.rowColumns = [];

    HtmlTableAdapter.__super__.constructor.call(this);

  };

  Utils.Extend(HtmlTableAdapter, BaseAdapter);

  HtmlTableAdapter.prototype.parseElement = function() {
    this.parseHeader();
    this.parseBody();
  }

  HtmlTableAdapter.prototype.parseHeader = function() {
    var headHtml = this.$head.html();
    if(this._cache.head==headHtml)
      return;

    var rows = this.$head.find('tr');
    var colMap = {};
    this.columns = [];
    this.rowColumns = [];
    
    for(var i = 0; i < rows.length; i++){
      var $row = $(rows[i]),
          cols = $row.find('td,th');

      colMap[i] = {};
      var k0 = 0;
      for(var j = 0; j < cols.length; j++){
        var $col = $(cols[j]),
            span = $col.attr('colspan') || 1,
            k1 = k0+span,
            colRepr = new Column(this, {title:$col.text()});
        $col.data('h5table-column', colRepr);
        if(i==rows.length-1){
          this.rowColumns.push(colRepr);
        }
        if(i==0){
          this.columns.push(colRepr);
        } else {
          colMap[i-1][k1].addColumn(colRepr);
        }
        for(var k = k0; k < k1; k++){
          colMap[i][k] = colRepr;
        }
      }
    }
    this._cache.head = headHtml;

    this.trigger('meta:updated', {
      table: this,
      meta: this.columns
    });
  };

  HtmlTableAdapter.prototype.parseBody = function() {
    var self = this,
        bodyHtml = this.$body.html();
    if(this._cache.body==bodyHtml)
      return;
    self.rows = [];
    this.$body.find('tr').each(function(index, el){
      var $row = $(el),
          $cols = $row.find('td,th');
      if($cols.length!=self.rowColumns.length)
        throw new Error('Expected '+self.rowColumns.length+' columns, but found '+$cols.length+' at row '+index+'.');
      var rowDef = new Row(self, {$row: $row});
      for(var j=0; j<$cols.length;j++){
        //debugger;
        var colDef = self.rowColumns[j];
        rowDef.setValue(colDef, $($cols[j]).text());
      }
      $row.data('h5table-row', rowDef);
      self.rows.push(rowDef);

    });

    this._cache.body = bodyHtml;
    
  };

  HtmlTableAdapter.prototype.bind = function (core, $element) {
    var self = this;

    core.on('query:updated', function(params){
      console.log('query:updated', arguments);
      self.query(params.query);
    });

    core.on('pagination:updated', function(params){

    });
  };

  HtmlTableAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by h5table
      $.removeData(this, 'data');
    });
  };

  HtmlTableAdapter.prototype.query = function (query) {
    this.parseElement();
    var results = query.applyTo(this.rows);
    console.log('HtmlTableAdapter::query', arguments, results);
    this.trigger('page:updated', {
      query: query,
      data: results
    });
  };

  return HtmlTableAdapter;
});
