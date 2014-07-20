$(function() {
    var socket = io.connect();
    socket.on('data', function(data) {

      
	for (var key in data.tech) {
            var val = data.tech[key] / data.techTotal;
            console.log(val);
            if (isNaN(val)) {
                val = 0;
            }
            $('li[data-tech="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            });
        }
       

    for (var key in data.entertainment) {
        var value = data.entertainment[key] / data.entertainmentTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-entertainment="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

    for (var key in data.autoIndustry) {
        var value = data.autoIndustry[key] / data.autoIndustryTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-autoIndustry="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

    for (var key in data.retail) {
        var value = data.retail[key] / data.retailTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-retail="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

    for (var key in data.mobileCarriers) {
        var value = data.mobileCarriers[key]/data.mobileCarriersTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-mobileCarriers="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

    for (var key in data.financial){
        var value = data.financial[key]/data.financialTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-financial="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

    for (var key in data.food) {
        var value = data.food[key]/data.foodTotal;
        if (isNaN(val)) {
                val = 0;
            }
        $('li[data-food="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            }); 
    }

     $('#last-update').text(new Date().toTimeString());
});
});
