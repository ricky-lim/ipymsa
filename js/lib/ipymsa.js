let widgets = require('@jupyter-widgets/base');
let _ = require('lodash');
let msa = require('msa');


let MsaModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name: 'MsaModel',
        _view_name: 'MsaView',
        _model_module: 'ipymsa',
        _view_module: 'ipymsa',
        _model_module_version: '0.1.0',
        _view_module_version: '0.1.0',
        value: '>seq1\nACTG\n >seq2\nACGG\n'
    })
});

let MsaView = widgets.DOMWidgetView.extend({
    getSeqnameLength: function (seqs) {
        let maxSeqName = _.maxBy(seqs, function (o) {
            return o.name.length;
        });
        return +maxSeqName.name.length;
    },
    render: function () {
        this.model.on('change:value', this.value_changed, this);
        let msaDiv = document.createElement('div');
        msaDiv.style.width = '500px';
        // msaDiv.setAttribute('id', 'msa');
        // document.getElementById('msa').style.width = '500px';
        this.el.appendChild(msaDiv);
        this.msaDiv = msaDiv;
        let seqs = msa.io.fasta.parse(this.model.get('value'));
        this.msa = new msa.msa({
            el: msaDiv,
            vis: {
                sequences: true,
                markers: false,
                metacell: false,
                conserv: false,
                overviewbox: false,
                seqlogo: false,
                gapHeader: false,
                leftHeader: false
            },
            zoomer: {
                autoResize: true,
                textVisible: false,
                alignmentWidth: 500,
                markerHeight: 5,
                labelNameLength: this.getSeqnameLength(seqs) * 10,
                // markerHeight: 10
            }
        });
        this.msa.seqs.reset(seqs);
        this.msa.render();

    },
    value_changed: function () {
        let seqs = msa.io.fasta.parse(this.model.get('value'));
        this.msa.seqs.reset(seqs);
        this.msa.g.zoomer.set("labelNameLength", this.getSeqnameLength(seqs) * 10);
        this.msa.render();
    }
});

module.exports = {
    MsaModel: MsaModel,
    MsaView: MsaView
};
