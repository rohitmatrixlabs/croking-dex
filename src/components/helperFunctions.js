import { BigNumber } from "ethers";

export function findSubsets(subset, nums, output, index)
{
    if (index === nums.length) {
        subset.push(output);
        return;
    }
    findSubsets(subset, nums, [...output], index + 1);
    output.push(nums[index]);
    findSubsets(subset, nums, [...output], index + 1);
}
//subset = []
// findSubsets(subset, yourArray, [], 0)
export function permute(letters) {
    let res = [];
    dfs(letters, [], Array(letters.length).fill(false), res);
    return res;
}

function dfs(letters, path, used, res) {
    if (path.length === letters.length) {
        // make a deep copy since otherwise we'd be append the same list over and over
        res.push(Array.from(path));
        return;
    }
    for (let i = 0; i < letters.length; i++) {
        // skip used letters
        if (used[i]) continue;
        // add letter to permutation, mark letter as used
        path.push(letters[i]);
        used[i] = true;
        dfs(letters, path, used, res);
        // remove letter from permutation, mark letter as unused
        path.pop();
        used[i] = false;
    }
}


export function allSubsets(nums) {
    const result = [];
    result.push([]);
    let size = nums.length
    for(let i = 1; i < (1<<size) ; i++){   
      let subset = [];
      let bitmask=0
        while(bitmask<size){
            if(i & (1 << bitmask)){           
                subset.push( nums[bitmask] );
            }
            bitmask++   
        }
        result.push(subset)
    }
    return result
  };


  export function findMax(arr){
    var val = BigNumber.from("0")
    var row = 0
    var col = 0
    const n = arr.length;
    const m = arr[0].length;
    for(var i = 0; i < n; i++){
        for(var j = 0; j < m; j++){
            if(BigNumber.from(arr[i][j]).gt(val)){
                val = BigNumber.from(arr[i][j]);
                row = i;
                col = j;
            }
        }
    }
    
    return [val, row, col];
  }