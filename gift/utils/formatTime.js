const formatDate=function(m, d) {
  (m < 10) && (m = "0" + m);
  (d < 10) && (d = "0" + d);
  return m + "." + d;
}
module.exports = {
  formatDate: formatDate
}
