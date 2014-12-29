$(document).ready(function(){
	// 先取得 #abgne-block-20120527 及其相關區塊及元素
	// 並依計算出每等份的寬度
	var _slices = 9,	// 切成幾等份
		_index = 0,		// 預設顯示第幾個
		_zIndex = 999, //Z-index 可以用來設置元素的 Z 方向位置，z-index 數字越大的在越上面，反之則在越下面。 
		$block = $('#window').css('position', 'relative'), /*id 裡所有資料丟進去*/
		$slides = $block.find('a').css('z-index', _zIndex).hide(), /*找到a */
		_width = $block.width(), 
		_height = $block.height(), 
		_sliceWidth = _width / _slices,	// 每等份的寬度
		_lastSliceWidth = _sliceWidth + (_width - _sliceWidth * _slices),	// 剩於的寬度
		_img = $slides.eq(_index).show().find('img').attr('src'), //讀取現在圖片 顯示 找到 藉由scr去找到那張圖片
		timer, 
		speed = 2000,	// 輪播速度 兩千毫秒
		_animateSpeed = 600,	// 動畫速度 0.6秒 百葉窗動畫速度
		_isHover = false,	// 滑鼠是否移到 $block 上 先設為false 之後會用到
		_isComplete = true;	// 動畫是否已全部執行完
 
	// 依 _slices 數量來產生相對應的 div 區塊
	var _sliceDiv = '', _control = '';
	for(var i=0;i<_slices;i++){
		var _w = i == _slices - 1 ? _lastSliceWidth : _sliceWidth, _l = i * _sliceWidth;//0~8 切割成九塊 如果是8 就是最後一片的寬度 其餘都是每片寬度
		_sliceDiv += '<div class="abgne-slice slide-' + i + '" style="left:' + _l +  //從左邊開始算一百兩百
		 'px;top:0;width:' + _w + 'px;height:100%;background-image:url(' + _img + ');
		 background-position:-' + _l + 'px 0;position:absolute;background-repeat:no-repeat;"></div>';
	}
 
	// 依 $slides 數量來產生按鈕
	for(var i=0;i<$slides.length;i++){ //圖片有幾張 li 
		_control += '<li class="abgne-control control-' + (i + 1) + '">' + (i + 1) + '</li>';
	} //x=x+y
 
	// 分別把 div 區塊及按鈕加入到 $block 中
	var $abgneSlides = $block.append(_sliceDiv, '<ul class="abgne-controls">' + _control + '</ul>').find('.abgne-slice'), //append 把整個ul加進去
		$abgneControls = $block.find('.abgne-controls').css('z-index', _zIndex + 2).find('li').eq(_index).addClass('current').end(); // 讓按鈕一直在最上面
 
	// 當點擊到 .abgne-controls li 時
	$abgneControls.click(function(){
		// 若動畫未完成前不接受其它新的事件
		if(!_isComplete) return;
 
		var $this = $(this), //當前Jquery處立的對象
			$slide = $slides.eq($this.index()),  //選擇當天處理到的照片順序
			_completeTotal = 0;
 
		// 若現在顯示的跟點擊到的是同一個時, 就不處理
		if($this.hasClass('current')) return;  //不換照片
 
		// 幫點擊到的 li 加上 .current, 並移除上一個 .current 
		$this.addClass('current').siblings('.current').removeClass('current');//砍他與他同階層的current
		_isComplete = false; //還沒換照片 變數換掉而已
		_index = $this.index(); //換成現在點擊的照片號
 
		// 取得相對應的圖片的路徑
		_img = $slide.find('img').attr('src');
		// 先讓每一個區塊的背景圖片為剛剛取得的圖片
		// 並進行動畫
		$abgneSlides.each(function(i){//每個都要跑
			var $ele = $(this);
			$ele.css({
				top: i % 2 == 0 ? _height : -_height,//百葉窗 展現方式 基數上往下 偶數下往上
				opacity: 0, //透明度
				zIndex: _zIndex + 1, //下層變到上層
				backgroundImage: 'url(' + _img + ')'
			}).stop().animate({ //執行css 定義的動畫
				top: 0, 
				opacity: 1
			}, _animateSpeed, function(){
				if(i == _slices - 1){ //i=8時 換掉照片
					$block.css('background-image', 'url(' + _img + ')');
					$slide.show().siblings('a:visible').hide();//把看得到的藏起來
					_isComplete = true;
					// 當動畫完成且滑鼠沒有移到 $block 上時, 再啟動計時器
					if(!_isHover)timer = setTimeout(auto, speed);//如果滑鼠沒有放在圖片上，計時器繼續
				}
			});
		});
	});
 
	$block.hover(function(){
		// 當滑鼠移入 $block 時停止計時器
		_isHover = true;
		clearTimeout(timer);
	}, function(){
		// 當滑鼠移出 $block 時啟動計時器
		_isHover = false;
		timer = setTimeout(auto, speed);//從零開始算 重新計時
	});
 
	// 自動輪播使用
	function auto(){
		_index = (_index + 1) % $slides.length;// 1/5=1 5/5=0回到原處
		$abgneControls.eq(_index).click();
	}
 
	// 啟動計時器
	timer = setTimeout(auto, speed);
});