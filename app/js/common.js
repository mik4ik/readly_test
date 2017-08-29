$(document).ready(function() {

    // Image popups
    $('.image-popup').magnificPopup({
      type: 'image',
      removalDelay: 500,
      callbacks: {
        beforeOpen: function() {
           this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
           this.st.mainClass = this.st.el.attr('data-effect');
        }
      },
      image: {
        titleSrc: 'title'
      },
      closeOnContentClick: true,
      midClick: true
    });

    // Anchor
    $('body').on('click', '[data-anchor]', function(event){
      var el = $(this).data('anchor');
      event.preventDefault();
      $('html, body').animate({
          scrollTop: $(el).offset().top
      }, 500);
    });

    // Comments
    var url = 'http://frontend-test.pingbull.com/pages/mik4ik@gmail.com/comments';

    function loadComments(count) {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                count: count
            },
            dateType: 'json',
            success: function (data) {

                function createdData(el) {
                    if(el.created_at){
                        var time = new Date(Date.parse(el.created_at)).toLocaleTimeString();
                        var date = new Date(Date.parse(el.created_at)).toLocaleDateString();
                        el.time = time;
                        el.date = date;
                    }
                }
                function testUser(el) {
                    if(el.author.id == 1){
                        el.edit = true
                    }else {
                        el.edit = false
                    }
                }

                $.each(data, function () {
                    createdData(this);
                    testUser(this);
                    $.each(this.children, function () {
                        createdData(this);
                    });
                });


                var arr = {};
                arr["comments"] = data;

                $(".b-content__comment__bottom").load("comments.html #commentList",function(){
                    var template = document.getElementById('commentList').innerHTML;
                    var output = templayed(template)(arr);
                    $(".b-content__comment__bottom").html(output);
                });

            }
        });
    }
    function newComment() {
        $('body').on('click', '.c-comment__form--new button', function () {
            var form = $(this).parents('.c-comment__form');
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: form.serialize(),
                success: function(data) {}
            });
            form[0].reset();
            loadComments(5);
            return false;
        });
    }
    function replyComment() {
        $('body').on('click', '.link-reply--js', function () {
            var parentDiv = $(this).parents('.c-comment__item');
            var settingsDiv = $(this).closest('.c-comment__setting');
            var id = parentDiv.data('id');
            $.ajax({
                url: url + '/' + id,
                type: 'GET',
                dateType: 'json',
                success: function (data) {
                    var templateForm = "<form action='/' class='c-comment__form c-comment__form--reply' id='commentFormReply'>" +
                        "<fieldset>" +
                        "<span><i class='icon-forward'></i>{{author.name}}</span>" +
                        "<span class='link-cancel--js right' data-setting='5'><i class='icon-cancel'></i>Cancel</span>" +
                        "</fieldset>" +
                        "<textarea placeholder='Your  Message' name='content'></textarea><input type='hidden' name='parent' value='{{id}}'>" +
                        "<button class='e-button right' type='submit'>Send</button>" +
                        "</form>";

                    var output = templayed(templateForm)(data);
                    $(output).insertAfter(settingsDiv);
                }
            });
        });
        $('body').on('click', '#commentFormReply button', function () {
            var form = $(this).parents('.c-comment__form');
            var id = form.closest('.c-comment__item').data('id');
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: form.serialize(),
                success: function(data) {}
            });
            form[0].reset();
            loadComments(5);
            return false;
        });
    }
    function editComment() {
        $('body').on('click', '.link-edit--js', function () {
            var parentDiv = $(this).parents('.c-comment__item');
            var settingsDiv = $(this).closest('.c-comment__setting');
            var id = parentDiv.data('id');
            $.ajax({
                url: url + '/' + id,
                type: 'GET',
                dateType: 'json',
                success: function (data) {
                    var templateForm = "<form action='/' class='c-comment__form c-comment__form--reply' id='commentFormEdit'>" +
                        "<fieldset>" +
                        "<span><i class='icon-forward'></i>{{author.name}}</span>" +
                        "<span class='link-cancel--js right' data-setting='5'><i class='icon-cancel'></i>Cancel</span>" +
                        "</fieldset>" +
                        "<textarea placeholder='Your  Message' name='content'>{{content}}</textarea>" +
                        "<button class='e-button right' type='submit'>Send</button>" +
                        "</form>";

                    var output = templayed(templateForm)(data);
                    $(output).insertAfter(settingsDiv);
                }
            });
        });
        $('body').on('click', '#commentFormEdit button', function () {
            var form = $(this).parents('.c-comment__form');
            var id = form.closest('.c-comment__item').data('id');
            $.ajax({
                url: url +'/'+ id,
                type: 'PUT',
                dataType: 'json',
                data: form.serialize(),
                success: function(data) {
                    loadComments(5);
                }
            });
            form.remove();
            return false;
        });
    }
    function removeComment() {
        $('body').on('click', '.link-delete--js', function () {
            var parentDiv = $(this).parents('.c-comment__item');
            var id = parentDiv.data('id');
            $.ajax({
                url: url + '/' + id,
                type: 'POST',
                dateType: 'json',
                data: {
                    _method: 'DELETE'
                }
            });
            loadComments(5);
        });
    }
    loadComments(5);
    newComment();
    editComment();
    removeComment();
    replyComment();

    $('body').on('click', '.link-cancel--js', function () {
        $(this).closest('form').remove();
    });
    $('body').on('click', '.link-more--js', function () {
        $(this).addClass('active');
        var count = $('.c-comment__item--parent').length;
        setTimeout(function () {
            loadComments(count+5);
        },500)
    });
});
