<template>
  <div class="hello">
    <h1>Tower</h1>
    <!-- <input v-model="message" placeholder="edit me" @input="handleFocus"> -->
    <!-- <div class="btn" @click="handleClick">RN页面</div> -->
    <!-- <input type="text" @focus="handleFocus" @blur="handleBlur"> -->

    <!-- 可以滚动的区域 -->
    <main>
    <input class="search" @focus="focus" @blur="blur">

      <div class="content">
        <p>
          当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。
          这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
          每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。
          当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。
          这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
          每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。
          这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
          每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。
          这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
          每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器。
          这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
          每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。
        </p>
      </div>
    </main>

    <!-- <footer id='footers' class="footer">

        <button class="btn" v-bind:class="{ focus: isFocus, blur: isBlur }" v-on:click="handleClick">RN页面</button>
    </footer>-->

    <footer>
      <input type="text" placeholder="Footer...">
      <button class="submit">提交</button>
    </footer>
  </div>
</template>

<script>
import Tower from "@souche-f2e/tower";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data: () => {
    return {
      isFocus: false,
      isBlur: false
    };
  },
  methods: {
    handleClick: () => {
      alert("");
    },
    handleFocus: () => {
      this.isFocus = true;
      alert("");
    },
    handleBlur: () => {
      this.isBlur = true;
      alert("b");
    },
    focus(e) {
      //考虑到footer不一定和input在一个组件内，所以没有使用vue的$refs
      var footer = document.getElementById("footers");
      footer.style.position = "static";
    },
    blur(e) {
      var footer = document.getElementById("footers");
      footer.style.position = "fixed";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

main {
  /* main绝对定位，进行内部滚动 */
  position: absolute;
  top: 50px;
  bottom: 34px;
  /* 使之可以滚动 */
  overflow-y: scroll;
    /* 增加该属性，可以增加弹性，是滑动更加顺畅 */
    -webkit-overflow-scrolling: touch;   
}


/* .footer {
  position: fixed;
  bottom: 0;
  left:0;
  right:0;
  width: 200px;
  height: 48px;
} */

footer {
  position: fixed;
  height: 34px;
  left: 0;
  right: 0;
  bottom: 0;
}

.focus {
  position: static;
}
.blur {
  position: fixed;
}
</style>
