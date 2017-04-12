$(document).ready(function(){
	//Показываем или скрываем кнопку "Наверх" при прокрутке страницы
	$(window).scroll(function(){
		if ($(window).scrollTop() > 100) {
			$('#scrollToTop').fadeIn();
		} else {
			$('#scrollToTop').fadeOut();
		}
	});

	//При нажатии на кнопку "Наверх", прокручиваем страницу
  $(document).on('click','#scrollToTop', function(){
      $("body").animate({scrollTop: 0}, "slow");
  });
});

//Инициализируем приложение
VK.init({
  apiId: 5976717//ID приложения
});

//Функция обработки ответа при авторизации
function authorize(response) {
	//Если пользователь авторизован и разрешил доступ приложению
  if (response.session) {
		//Вызываем функцию получения фотографий и передаём в неё id пользователя
    getPhotos(response.session.mid)
  }
	//Если окно авторизации будет закрыто
  else {
    alert("Авторизация не прошла");
  }
}

//Функция получения фотографий. Принимает id пользователя
function getPhotos(owner_id){
	//Параметры для функции запроса фотографий
	var param = {"owner_id" : owner_id,//ID
							 "album_id" : "wall",//Место, откуда будут получены фотографии. В данном случае со стены пользователя
							 "version"  : "5.63",
							 "extended" : "true",//Получение дополнительных полей (кол-во лайков, репостов, комментариев)
							 "rev"      : "1"};//Антихронологический порядок фотографий

	//Вызываем функцию photos.get. Возвращает data
  VK.Api.call('photos.get', param, function(data) {
		//Если возникнет ошибка
    if (data.error) {
      alert(data.error.error_msg);
    } else {
			//Если кол-во записей в ответе больше 0
      if (data.response.length > 0) {
				$('body').css("overflow", "hidden");//Запрещаем прокрутку страницы до окончания загрузки картинок
        $('.refbutton').html("Обновить");
        $('.refbutton').css('padding', '15px 95px 15px 95px');
        $('#main').css({marginTop: '100%', transition: '1.2s'});//Перемещаем контейнер с картинками за пределы экрана
				$(".refbutton").attr( "href", "#");//Обезопасим от множественного нажатия
				//Устанавливаем таймаут
        setTimeout(function () {
          $('#main').empty();//Очищаем контейнер с картинками
					//Проходим по массиву response
          for (i = 0; i < data.response.length; i++) {
            var src = data.response[i]['src_big'];//Ссылка на картинку
            var c_likes = data.response[i]['likes']['count'];//Кол-во лайков
            var c_reposts = data.response[i]['reposts']['count'];//Кол-во репостов
            var c_comments = data.response[i]['comments']['count'];//Кол-во комментариев

            $('#main').append('<div class="block block_'+i+'"></div>');//Добавляем в главный контейнер новый блок
            var cur_block = $('.block_'+i+'');
            cur_block.append('<img src='+src+'>');//Добавляем в блок картинку
            cur_block.append('<hr><div><img src="./images/like.png"><p>'+c_likes+'</p></div>')//Добавляем кол-во лайков, репостов и комментариев
            cur_block.append('<div><img src="./images/repost.png"><p>'+c_reposts+'</p></div>')
            cur_block.append('<div><p>Комментарии: '+c_comments+'</p></div>')
          }
          $('#main').css({marginTop: '30px', transition: '1.2s'});//Поднимаем контейнер вверх
					$('body').css("overflow", "scroll");//Разрешаем прокрутку страницы
					$(".refbutton").attr( "href", "javascript:VK.Auth.login(authorize);");
        }, 1600);
      }
    }
  });
}
