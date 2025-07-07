<script setup lang="ts" name="CustomButton">
import { useNamespace } from "@/composables";

const ns = useNamespace("custom-button");
</script>

<template>
  <div :class="ns.b()">
    <el-button class="btn java">JAVA攻城狮</el-button>
    <el-button class="btn golang">Golang工程师</el-button>
    <el-button class="btn js"><span>js攻城狮</span></el-button>
    <el-button class="btn nodd-ruby ruby">
      <div class="anim"></div>
      <span>Ruby攻城狮</span>
    </el-button>

    <el-button class="btn vb">
      <span>VB攻城狮</span>
      <div class="dot"></div>
    </el-button>
    <el-button class="btn python python-1">python攻城狮</el-button>
    <el-button class="btn python python-2">python攻城狮</el-button>
    <el-button class="btn python python-3">python攻城狮</el-button>
    <el-button class="btn python python-4">python攻城狮</el-button>
    <el-button class="btn python python-5">python攻城狮</el-button>

    <el-button class="btn php php-1">php攻城狮</el-button>
    <el-button class="btn php php-2">php攻城狮</el-button>
    <el-button class="btn php php-3">php攻城狮</el-button>
    <el-button class="btn php php-4">php攻城狮</el-button>
    <el-button class="btn php php-5">php攻城狮</el-button>

    <el-button class="btn kotlin kotlin-3">kotlin攻城狮</el-button>
    <el-button class="btn kotlin kotlin-1">kotlin攻城狮</el-button>
    <el-button class="btn kotlin kotlin-4">kotlin攻城狮</el-button>
    <el-button class="btn kotlin kotlin-2">kotlin攻城狮</el-button>
    <el-button class="btn kotlin kotlin-5">kotlin攻城狮</el-button>
    <el-button class="btn c">C语言攻城狮</el-button>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(custom-button) {
  @keyframes sheen {
    0% {
      transform: skewY(-45deg) translateX(0);
    }

    100% {
      transform: skewY(-45deg) translateX(12.5em);
    }
  }

  @keyframes anim-in {
    0% {
      width: 0%;
    }

    100% {
      width: 100%;
    }
  }

  @keyframes anim-in-pseudo {
    0% {
      background: rgb(0 0 0 / 30%);
    }

    100% {
      background: transparent;
    }
  }

  @keyframes anim-out {
    0% {
      width: 0%;
    }

    100% {
      width: 100%;
    }
  }

  @keyframes anim-out-pseudo {
    0% {
      background: rgb(0 0 0 / 35%);
    }

    100% {
      background: transparent;
    }
  }

  @keyframes halftone {
    100% {
      background-size:
        2.375em 2.375em,
        0.1em 0.1em;
    }
  }

  @keyframes stripes-move {
    100% {
      background-position: 5em 0;
    }
  }

  @keyframes sawtooth {
    100% {
      background-position: 1em 0;
    }
  }

  @keyframes zigzag {
    100% {
      background-position:
        1em 0,
        1em 0,
        -0.75em 0,
        -0.75em 0;
    }
  }

  @keyframes pulse {
    50% {
      background-position:
        0.66em 0.66em,
        -0.33em -0.33em;
    }

    100% {
      background-position:
        -1.5em -1.5em,
        -1em -1em;
      background-size:
        2em 2em,
        1em 1em;
    }
  }

  /* calc(122px - 36px)  按钮宽度 - dot宽度 - 边框宽度 */
  @keyframes atom {
    0% {
      transform: translateX(0) rotate(0);
    }

    30% {
      transform: translateX(calc(122px - 42px)) rotate(0);
    }

    50% {
      transform: translateX(calc(122px - 42px)) rotate(180deg);
    }

    80% {
      transform: translateX(0) rotate(180deg);
    }

    100% {
      transform: translateX(0) rotate(360deg);
    }
  }

  .btn {
    width: 122px;
    height: 44px;
    margin: 15px;
    line-height: 44px;
    vertical-align: top;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
  }

  .java {
    width: 120px;
    height: 42px;
    line-height: 42px;
    color: #eb9e05;
    border: 1px solid #eb9e05;
    opacity: 1;
    transition: all 0.6s;
  }

  .java:hover {
    color: #ffffff;
    background: #eb9e05;
  }

  .java:active {
    opacity: 0.7;
  }

  .c {
    height: 44px;
    line-height: 44px;
    background: #55acee;
    box-shadow: 0 5px 0 0 #3486d5;
    transition: all 0.5s;
  }

  .c:hover {
    background-color: #6fc6ff;
  }

  .c:active {
    box-shadow: 0 1px 0 0 #3486d5;
    transform: translate(0, 4px);
  }

  .golang {
    position: relative;
    width: 120px;
    height: 42px;
    overflow: hidden;
    line-height: 42px;
    vertical-align: top;
    color: #2194e0;
    border: 1px solid #2194e0;
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }

  .golang::before {
    position: absolute;
    top: 0;
    left: -4.5em;
    display: block;
    width: 3em;
    height: 100%;
    content: "";
    background-color: rgb(255 255 255 / 50%);
    transform: skewX(-45deg) translateX(0);
    transition: none;
  }

  .golang:hover {
    color: #ffffff;
    background-color: #2194e0;
  }

  .golang:hover::before {
    transform: skewX(-45deg) translateX(260px);
    transition: all 0.5s ease-in-out;
  }

  .golang:active {
    opacity: 0.8;
  }

  .js {
    width: 120px;
    height: 42px;
    overflow: hidden;
    line-height: 42px;
    background: #00dd66;
    border: 1px solid #00dd66;
    opacity: 1;
    transition: all 0.5s;
  }

  .js:hover,
  .js:active {
    color: #00cc55;
    text-decoration: none;
    background: #ffffff;
    border-color: #00cc55;
  }

  .js:active {
    opacity: 0.8;
  }

  .js span {
    position: relative;
    display: inline-block;
    padding-right: 0;
    transition: padding-right 0.5s;
  }

  .js span::after {
    position: absolute;
    top: 0;
    right: -18px;
    width: 10px;
    height: 10px;
    margin-top: -10px;
    content: " ";
    background: rgb(0 0 0 / 0%);
    border: 2px solid #ffffff;
    border-top: none;
    border-right: none;
    opacity: 0;
    transform: rotate(-140deg);
    transition:
      opacity 0.5s,
      top 0.5s,
      right 0.5s;
  }

  .js:hover span,
  .js:active span {
    padding-right: 30px;
  }

  .js:hover span::after,
  .js:active span::after {
    top: calc(50% + 2.5px);
    right: 0;
    border-color: #00cc55;
    opacity: 1;
    transform: rotate(-140deg);
    transition:
      opacity 0.5s,
      top 0.5s,
      right 0.5s;
  }

  .nodd-ruby {
    position: relative;
    z-index: 0;
    overflow: hidden;
    cursor: pointer;
    background: #c147e6;
    opacity: 1;
    transition: all 0.3s;
  }

  input[type="checkbox"].toggle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
  }

  input[type="checkbox"].toggle:focus {
    outline: 0;
  }

  .anim {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
  }

  .anim::before {
    position: relative;
    display: block;
    margin-top: 100%;
    content: "";
  }

  .anim::after {
    position: absolute;
    inset: 0;
    content: "";
    border-radius: 50%;
  }

  .node .toggle:checked + .anim {
    animation: 0.75s anim-in;
  }

  .node .toggle:checked + .anim::after {
    animation: anim-in-pseudo 0.75s;
  }

  .node .toggle:not(:checked) + .anim {
    animation: anim-out 0.75s;
  }

  .node .toggle:not(:checked) + .anim::after {
    animation: anim-out-pseudo 0.75s;
  }

  .node {
    background: #ed3f14;
  }

  .node:hover {
    opacity: 0.8;
  }

  .ruby:active {
    opacity: 0.8;
  }

  .ruby:hover > .anim {
    animation: anim-out 0.75s;
  }

  .ruby:hover > .anim::after {
    animation: anim-out-pseudo 0.75s;
  }

  .python {
    background-size: 200% auto;
    transition: 0.5s;
  }

  .python:hover {
    background-position: right center;
  }

  .python-1 {
    background-image: linear-gradient(to right, #f6d365 0%, #fda085 51%, #f6d365 100%);
  }

  .python-2 {
    background-image: linear-gradient(to right, #fbc2eb 0%, #a6c1ee 51%, #fbc2eb 100%);
  }

  .python-3 {
    background-image: linear-gradient(to right, #84fab0 0%, #8fd3f4 51%, #84fab0 100%);
  }

  .python-4 {
    background-image: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%);
  }

  .python-5 {
    background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 51%, #ffecd2 100%);
  }

  .php,
  .php::after {
    transition: all 0.5s;
  }

  .php {
    position: relative;
    z-index: 1;
    width: 120px;
    height: 42px;
    line-height: 42px;
    color: #c147e6;
    text-transform: uppercase;
    border: 1px solid #c147e6;
  }

  .php:hover {
    color: #ffffff;
  }

  .php::before,
  .php::after {
    position: absolute;
    z-index: -2;
    content: "";
    background: #c147e6;
    border-radius: 3px;
  }

  .php-1::after {
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
  }

  .php-1:hover::after {
    height: 100%;
  }

  .php-2::after {
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
  }

  .php-2:hover::after {
    width: 100%;
  }

  .php-3::after {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
  }

  .php-3:hover::after {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .php-4::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .php-4::after {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  .php-4:hover::after {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
  }

  .php-5 {
    overflow: hidden;
  }

  .php-5::after {
    top: 0;
    left: -35%;
    width: 0;
    height: 100%;
    transform: skew(50deg);
    transform-origin: top left;
    transition-duration: 0.6s;
  }

  .php-5:hover::after {
    width: 135%;
    height: 100%;
  }

  .kotlin {
    width: 120px;
    height: 42px;
    line-height: 42px;
    text-transform: inherit;
    letter-spacing: inherit;
    background: none;
    border: 1px solid;
    transition: color 1s;
  }

  .kotlin-1 {
    color: #9c89f7;
  }

  .kotlin-1:hover {
    color: #e4f789;
    background:
      radial-gradient(circle, #9c89f7 0.2em, transparent 0.25em) 0 0/1.25em 1.25em,
      radial-gradient(circle, #9c89f7 0.2em, transparent 0.25em) 6.25em 6.25em/1.25em 1.25em;
    animation: halftone 1s forwards;
  }

  .kotlin-2 {
    color: #82f6d8;
  }

  .kotlin-2:hover {
    color: #f682a0;
    background: repeating-linear-gradient(45deg, #82f6d8 0, #82f6d8 0.25em, transparent 0.25em, transparent 0.5em);
    animation: stripes-move 0.75s infinite linear;
  }

  .kotlin-3 {
    color: #d3f169;
  }

  .kotlin-3:hover {
    color: #8769f1;
    background:
      linear-gradient(45deg, #d3f169 0.5em, transparent 0.5em) 0 0/1em 1em,
      linear-gradient(-45deg, #d3f169 0.5em, transparent 0.5em) 0 0/1em 1em;
    animation: sawtooth 0.35s infinite linear;
  }

  .kotlin-4 {
    color: #eea163;
  }

  .kotlin-4:hover {
    color: #63b0ee;
    background:
      linear-gradient(135deg, rgb(238 161 99 / 25%) 0.25em, transparent 0.25em) -0.5em 0,
      linear-gradient(225deg, rgb(238 161 99 / 25%) 0.25em, transparent 0.25em) -0.5em 0,
      linear-gradient(315deg, rgb(238 161 99 / 25%) 0.25em, transparent 0.25em) 0 0,
      linear-gradient(45deg, rgb(238 161 99 / 25%) 0.25em, transparent 0.25em) 0 0;
    background-size: 0.75em 0.75em;
    animation: zigzag 1s linear infinite;
  }

  .kotlin-5 {
    color: #f9879b;
  }

  .kotlin-5:hover {
    color: #0bdcb7;
    background:
      radial-gradient(circle, rgb(249 135 155 / 25%) 43%, transparent 50%) 0 0/1em 1em,
      radial-gradient(circle, rgb(249 135 155 / 25%) 43%, transparent 50%) 0.5em 0.5em/2em 2em;
    animation: pulse 1s ease-in infinite;
  }

  .vb::before,
  .vb::after {
    box-sizing: border-box;
  }

  .vb {
    position: relative;
    width: 120px;
    height: 44px;
    line-height: 42px;
    color: #fa5555;
    text-transform: uppercase;
    border: 2px solid #fa5555;
    border-radius: 14px;
  }

  .dot {
    position: absolute;
    top: 0;
    left: 2px;
    display: none;
    width: 32px;
    height: 100%;
    content: "";
    border-radius: 50%;
    transition: all 300ms ease;
  }

  .dot::after {
    position: absolute;
    top: -6px;
    width: 5px;
    height: 5px;
    content: "";
    background: #fa5555;
    border: 4px solid #fa5555;
    border-radius: 50%;
    box-shadow:
      0 0 0.7em #ffffff,
      0 0 2em #fa5555;
  }

  .vb:hover .dot,
  .vb:focus .dot {
    display: block;
    animation: atom 2s infinite linear;
  }
}
</style>
