var div = document.createElement('div'); 
	div.style.position="fixed";
	div.style.left="0";
	div.style.bottom="0";
	div.style.width="100%";
	div.style.zIndex="100";
	div.style.background="#FFFFFF";
	document.body.appendChild(div); 
	var iframe = document.createElement('iframe');
	iframe.src="t1.html";  
	iframe.style.display = "block";
	iframe.style.width = "100%";
	iframe.style.height="80px";
	iframe.style.border = "0";
	iframe.scrolling = "no";
	div.appendChild(iframe);