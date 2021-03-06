function modelInfo() {
    $.ajax(SERVICE_MODEL_INFO, {
            dataType: 'json',
            type: 'get',
        })
        .done(function(data) {
            data = data.data;

            var tags = []
            data.forEach(function(e) {
                tags.push({
                    tag: e.name,
                    f1: e.information.accuracy
                });
            }, this);

            tags.sort(function(a, b) {
                return b.f1 - a.f1;
            });

            Morris.Bar({
                element: 'model-vs-f1',
                data: tags,
                xkey: 'tag',
                ykeys: ['f1'],
                labels: ['F1'],
                barColors: ['#0E6EB8']
            });
        })
        .error(function(err) {

        })
        .always(function() {

        })
}

function tagTypeCount() {
    $.ajax(SERVICE_MODEL_TAG_TYPE, {
            dataType: 'json',
            type: 'get',
        })
        .done(function(data) {
            data = data.data;

            var tags = []
            data.forEach(function(e) {
                tags.push({
                    label: e.type,
                    value: e.count
                });
            }, this);

            Morris.Donut({
                element: 'manual-vs-auto',
                data: tags,
                colors: ['#1678c2', '#DB2828']
            });
        })
        .error(function(err) {

        })
        .always(function() {

        })
}

function tagAssocData() {
    $.ajax(SERVICE_ASSOC_DATA_SIZE, {
            dataType: 'json',
            type: 'get',
        })
        .done(function(data) {
            data = data.data;

            var tags = {}

            data.forEach(function(e) {
                if (typeof(tags[e.name]) == 'undefined') {
                    tags[e.name] = {
                        document: 1,
                        paragraph: Number(e.count)
                    }
                } else {
                    tags[e.name].document += 1;
                    tags[e.name].paragraph += Number(e.count);
                }
            }, this);

            data = [];
            Object.keys(tags).forEach(function(e) {
                data.push({
                    tag: e,
                    document: tags[e].document,
                    paragraph: tags[e].paragraph,
                });
            });

            data.sort(function(a, b) {
                return b.paragraph - a.paragraph;
            });

            Morris.Bar({
                element: 'tag-vs-parag',
                data: data,
                xkey: 'tag',
                ykeys: ['document', 'paragraph'],
                labels: ['#Document', '#Paragraph'],
                barColors: ['#008080', '#0E6EB8']
            });
        })
        .error(function(err) {

        })
        .always(function() {

        })
}

function documentGrowth() {
    $.ajax(SERVICE_DOC_AND_PARAGRAPH_GROWth, {
            dataType: 'json',
            type: 'get',
        })
        .done(function(data) {
            data = data.data;

            graphData = [];

            var docCount = 0;
            var paragraphCount = 0;

            Object.keys(data).forEach(function(date) {
                docCount += data[date].doc;
                paragraphCount += data[date].paragraph;
                graphData.push({
                    date: date,
                    document: docCount,
                    paragraph: paragraphCount,
                });
            });

            Morris.Line({
                element: 'doc-vs-parag',
                data: graphData,
                xkey: 'date',
                ykeys: ['document', 'paragraph'],
                labels: ['#Document', '#Paragraph'],
                lineColors: ['#008080', '#0E6EB8']
            });
        })
        .error(function(err) {

        })
        .always(function() {

        })
}

modelInfo();
tagTypeCount();
tagAssocData();
documentGrowth();

// Morris.Bar({
//     element: 'model-vs-f1',
//     data: [
//         { tag: 'Active', f1: 0.8 },
//         { tag: 'PBL', f1: 0.75 },
//         { tag: 'TF-Teacher', f1: 0.7 },
//         { tag: 'TF-Student', f1: 0.75 },
//         { tag: 'Teacher', f1: 0.85 },
//         { tag: 'Student', f1: 0.65 },
//         { tag: 'Math', f1: 0.72 },
//         { tag: 'Science', f1: 0.65 },
//     ],
//     xkey: 'tag',
//     ykeys: ['f1'],
//     labels: ['F1'],
//     barColors: ['#0E6EB8']
// });

// Morris.Bar({
//     element: 'tag-vs-parag',
//     data: [
//         { tag: 'Active Learning', document: 20, paragraph: 90 },
//         { tag: 'PBL', document: 10, paragraph: 65 },
//         { tag: 'Trans Teacher', document: 7, paragraph: 40 },
//         { tag: 'Trans Student', document: 13, paragraph: 65 },
//         { tag: 'Teacher', document: 25, paragraph: 40 },
//         { tag: 'Student', document: 20, paragraph: 65 },
//         { tag: 'Math', document: 5, paragraph: 90 }
//     ],
//     xkey: 'tag',
//     ykeys: ['document', 'paragraph'],
//     labels: ['#Document', '#Paragraph'],
//     barColors: ['#008080', '#0E6EB8']
// });

// Morris.Donut({
//     element: 'manual-vs-auto',
//     data: [
//         { label: "Manual Tagged", value: 12 },
//         { label: "Auto Tagged", value: 30 },
//         { label: "Not tagged", value: 20 }
//     ],
//     colors: ['#1678c2', '#008080', '#DB2828']
// });