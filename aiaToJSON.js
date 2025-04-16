const hexToUtf8 = (str) => decodeURIComponent(str.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
const decimalToAscii = (str) => hexToUtf8(Number(str).toString(16));

const aiaToJSON = (str, decode = false) => {
   // Sometimes the value of the "/value" key is an ASCII string encoded as decimal.
   // Converter will not decode such values, even if decode = true, because it is impossible to determine that the value was actually encoded.

   const data = str.split("/");
   const json = {};
   const stack = [json];
   let current = stack[0];

   for (let i = 1; i < data.length; i++){
      const line = data[i].trim().replace(/\s+/g, " ");
      const delimIndex = line.indexOf(" ");
      const key = line.substring(0, delimIndex);
      let val = line.substring(delimIndex).trim();

      if (["action", "event", "parameter"].some(e => key.startsWith(e + "-"))){

         const prop = key.split("-")[0];
         if (Array.isArray(current)){
            current.push({});
            current = current[current.length-1];
            stack.push(current);
         } else {
            current[`${prop}s`] = [{}];
            current = current[`${prop}s`];
            stack.push(current, (current = current[0]));
         }

         continue;
      } 
      
      else if (Array.isArray(current)){
         stack.pop();
         current = stack[stack.length-1];
      }

      let isHexValue = false;
      if (val.startsWith("[")){
         isHexValue = true;
         val = val.replace(/\[\s?\d+|\s?\]/g, "").trim(); // remove square brackets and hex string length value [ 4 53746f70 ] => 53746f70
      }

      val = val.replace(/(?<!unit)\s/g, "");
      const closeBracketIndex = val.indexOf("}");
      let nestedLevels = 0;

      if (closeBracketIndex != -1){
         nestedLevels = val.length - closeBracketIndex;
         val = val.substring(0, closeBracketIndex);
      }

      const value = val.trim();
      if (decode && isHexValue)
         current[key] = hexToUtf8(value);
      else if (decode && (key == "key" || key == "unit"))
         current[key] = decimalToAscii(value);
      else
         current[key] = /^-?\d\d*\.?\d*$/.test(value) && !/name$/i.test(key)? Number(value) : value/* .replace(/^\(|\)$/g, "") //also remove round brackets */

      while(nestedLevels--){
         if (Array.isArray(current)) stack.pop();
         stack.pop();
         current = stack[stack.length-1];
      }
   }

   return json;
}

module.exports = aiaToJSON;