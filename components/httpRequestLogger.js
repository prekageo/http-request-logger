Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
function HttpRequestLogger() {
  var httpRequestLogger =
  {
    observe: function(subject, topic, data) 
    {
      if (topic == "http-on-modify-request") {
        var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
        var ref = httpChannel.referrer ? httpChannel.referrer.spec : "(none)";
        var buffer = ref + " " + httpChannel.requestMethod + " " + httpChannel.URI.spec + "\n";
        fos.write(buffer, buffer.length);
      }
    }
  };
  
  var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Desk", Components.interfaces.nsIFile);
  file.append("http-request-log.txt");
  var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
  // PR_WRONLY | PR_CREATE_FILE | PR_APPEND
  fos.init(file, 0x02 | 0x08 | 0x10, -1, 0);
  
  var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  observerService.addObserver(httpRequestLogger, "http-on-modify-request", false);
}

HttpRequestLogger.prototype.classID = Components.ID('{c4a9bb50-b9b2-11e0-a4dd-0800200c9a66}');
HttpRequestLogger.prototype.classDescription = 'Http Request Logger XPCOM Component';
HttpRequestLogger.prototype.contractID = '@prekageo/HttpRequestLogger;1';
var NSGetFactory = XPCOMUtils.generateNSGetFactory([HttpRequestLogger]);
