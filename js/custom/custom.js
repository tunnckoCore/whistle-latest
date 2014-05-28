$(function() {
    var files;
    var APP_ROOT_URI = 'http://84.238.137.3/GrithAPI/wclz3/';
    $('input[type="file"]').on('change', prepareUpload);
    $('form').on('submit', uploadFiles);

    function prepareUpload(event) {
        files = event.target.files;
    }

    function uploadFiles(event) {
        event.stopPropagation();
        event.preventDefault();

        var data = new FormData();
        $.each(files, function(key, value) {
            data.append(key, value);
        });
        $.ajax({
            url: 'uploader.php?files',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    submitForm(event, data);
                } else {
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('ERRORS: ' + textStatus);
            }
        });
    }

    function submitForm(event, data) {
        $form = $(event.target);
        var formData = $form.serialize();
        $.each(data.files, function(key, value) {
            formData = formData + '&filenames[]=' + value;
        });
        $.ajax({
            url: 'uploader.php',
            type: 'POST',
            data: formData,
            cache: false,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    console.log('SUCCESS: ' + data.success);
                    $arrie = data.formData.filenames;
                    resultsNum = $arrie.length;
                    $bitlys = data.formData.bitlymeta;
                    $('#tmfLoadPage').remove();
                    $('#tmfResults').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Честито!</strong> Успешно са качени <b>' + resultsNum + '</b> изображения. Може да видите информация за тях по-надолу.</div>');
                    $.each($arrie, function(key, value) {
                        $('#tmfResults').append('<div class="tmf-bitly-sho' + key + 'rt"></div>');
                        var resultItem_BoxTitle = 'Информация за ' + value;
                        bitlyApiShorten(APP_ROOT_URI + 'uploads/' + value, function(short_url) {
                            $('.tmf-bitly-direct' + key + 'link-image').attr('src', short_url);
                            $('.tmf-bitly-direct' + key + 'link-input').attr('value', short_url);
                            $('.tmf-bitly-direct' + key + 'link-inputLink').attr('href', short_url);
                        });
                        bitlyApiShorten(APP_ROOT_URI + 'p/' + value, function(short_url) {
                            $('.tmf-bitly-short' + key + 'link-image').attr('href', short_url);
                            $('.tmf-bitly-short' + key + 'link-input').attr('value', short_url);
                            $('.tmf-bitly-short' + key + 'link-inputLink').attr('href', short_url);
                        });
                        var theKey = (key + 1);
                        if (theKey == resultsNum) {
                            $('#tmfResults').append('<div class="tmf page-content tmf-result-numb' + theKey + 'er">');
                        } else {
                            $('#tmfResults').append('<div class="tmf page-content tmf-result-numb' + theKey + 'er" style="padding-bottom: 4%;">');
                        }
                        $('#tmfResults .tmf-result-numb' + theKey + 'er').append('<div class="titler themebg">\n\                                    <h3>\n\                                        ' + resultItem_BoxTitle + '\n\                                        <span class="pull-right">\n\                                            #' + theKey + ' &nbsp;\n\                                        </span>\n\                                    </h3>\n\                                </div>\n\                                <div class="bodyr">\n\                                    <div class="body-content">\n\                                        <div class="tmf results-media">\n\                                            <div class="row">\n\                                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">\n\                                                    <a href="" target="_blank" class="tmf-bitly-short' + key + 'link-image">\n\                                                        <img class="img-responsive tmf-bitly-direct' + key + 'link-image" src="" alt="' + value + '" title="' + value + '">\n\                                                    </a>\n\                                                </div>\n\                                                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">\n\                                                    <div class="input-group">\n\                                                        <input type="text" class="form-control tmf-bitly-direct' + key + 'link-input" value="">\n\                                                        <span class="input-group-btn">\n\                                                            <a href="" target="_blank" class="btn btn-primary themebg tmf-bitly-direct' + key + 'link-inputLink">Direct Link</a>\n\                                                        </span>\n\                                                    </div>\n\                                                    <br>\n\                                                    <div class="input-group">\n\                                                        <input type="text" class="form-control tmf-bitly-short' + key + 'link-input" value="">\n\                                                        <span class="input-group-btn">\n\                                                            <a href="" target="_blank" class="btn btn-primary themebg tmf-bitly-short' + key + 'link-inputLink">Image Link</a>\n\                                                        </span>\n\                                                    </div>\n\                                                </div>\n\                                            </div>\n\                                        </div>\n\                                    </div>\n\                                </div>\n\                            </div>');
                    });
                    files = [];
                    $form = null;
                    return false;
                } else {
                    // Handle errors here                   
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Handle errors here       
                console.log('ERRORS: ' + textStatus);
            },
            complete: function() {
                // STOP LOADING SPINNER       
            }
        });
    } /* Bitly JS Api */
    function bitlyApiShorten(long_url, cbfunc) {
        var bitlyUrl = long_url;
        var bitlyLogin = "o_7lhtle464r"; // bit.ly username    
        var bitlyApiKey = "R_fb96aa701e990e7d6098a55cb4a9e335";
        $.getJSON("http://api.bitly.com/v3/shorten?callback=?", {
            "format": "json",
            "apiKey": bitlyApiKey,
            "login": bitlyLogin,
            "longUrl": bitlyUrl
        },
        function(response) {
            cbfunc(response.data.url);
        }
        );
    }
    window.prettyPrint && prettyPrint();
    $("#tmfMainMenu li a").click(function() {
        var e = $(this).attr("data-href");
        //if ($("#tmfLoadPage div")) {
        //    $("#tmfLoadPage div").remove()
        //}
        //$("#tmfLoadPage").load("pages/" + e + ".html")
    });
    $(".tmf.page-content .box-front .click-flip").click(function() {
        $(".tmf.page-content").addClass("flipers")
    });
    $(".tmf.page-content .box-back .click-flip").click(function() {
        $(".tmf.page-content").removeClass("flipers")
    });
    $("#tmfMainMenu a").click(function() {
        $("#tmfMainMenu li").removeClass("active")
    });
    $(".tmf.collorize li").tooltip();
    $(".tmf.brand-nav a:first-child").tooltip();
    $(".tmf.brand-nav nav a:first-child span").tooltip();
    if ($.cookie("themeColor")) {
        $(".tmf.projection").addClass($.cookie("themeColor"))
    }
    $(".add-class").click(function(e) {
        e.preventDefault();
        var t = $(e.target);
        if ($(".tmf.projection").hasClass($.cookie("themeColor"))) {
            $(".tmf.projection").removeClass($.cookie("themeColor"))
        }
        $(".tmf.projection").addClass(t.attr("data-color"));
        $.cookie("themeColor", null);
        $.cookie("themeColor", t.attr("data-color"), {
            expires: 5 * 60 * 60,
            path: "/"
        })
    });
    $(".tmf-background-ads .advertise").click(function(evntr) {
        if ($(this).attr('data-href') == "") {
            return false;
        } else {
            window.open($(this).attr('data-href'), '_blank');
            return false;
        }
    });
})
