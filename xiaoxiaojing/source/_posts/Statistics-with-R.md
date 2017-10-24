---
title: 概率论和统计学
date: 2017-09-18 20:43:07
tags:
---

## install the R
* use the `brew` package manager to install R
```
brew tap homebrew/science
brew install r
```

## 概率论
### 事件
1. 基本事件（用E表示）：在一次随机试验中可能发生的不能再细分的结果
2. 事件空间（用S表示）：在随机试验中可能发生的所有基本事件的集合
3. 随机事件（用A,B,C...表示）：是事件空间的子集
4. 必然事件 和 不可能事件
5. 事件的计算
  <div style="width:600px">
  {% asset_img 事件运算.png%}
  </div>

### 概率
* 维恩图（Venn diagrams）：表示事件及其概率

#### 概率的定义
1. 传统概率（拉普拉斯概率）：如果一个随机试验所包含的事件是有限的，并且每个事件发生的可能性均相等，则这个试验叫做拉普拉斯试验
  * 事件A在事件空间S中的概率记为P(A)：P(A) = 构成事件A的元素数目/构成事件空间S的所有元素数目
2. 统计概率：对一个事件做相互独立的n次随机试验，随着次数n的增加，相对频率会趋向于一个极限值，这个极限值被称为统计概率
<div style="width:200px">
{% asset_img 统计概率.png%}
</div>
3. 现代概率论
  * 概率公理：
    - 0 ≤ P(A) ≤ 1
    - P(S) = 1
    - P(A ∪ B) = P(A) + P(B)，如果 A ∩ B = ∅

#### 概率的计算
* 边际概率（marginal probabilities）p(A)
* 联合概率（joint probabilitie）: P(A ∩ B)
* 条件概率（conditional probabilities）: P(B|A)
* 互补法则(complementary)：如果两个事件互补，P(A) + 【P(A)的补集】= 1
* 不可能事件的概率为0：P(∅) = 0
* 相交于不相交事件
  - 不相交事件（disjoint events）：不可能同时存在的事件 P(A ∩ B) = 0
  - 相交事件（non-disjoint events）：P(A ∩ B) ≠ 0
* 计算（A ∪ B）
  -  P(A ∪ B) = P(A) + P(B) − P(A ∩ B) （A,B是相交的）
  -  P(A ∪ B) = P (A) + P (B) （A,B不相交P(A ∩ B) = 0）
* 如果事件 A，B 是差集关系：P(A \ B)=P(A)-P(A ∩ B)
* 乘法法则：`P(A ∩ B) = P(A)*P(B|A)=P(B)*P(A|B)`
  - 贝叶斯（Bayesian）公式：`P(A|B) = P(A)*P(B|A)/P(B)`
* 独立事件（independent events）：P(A|B) = P(A) 或者 P(A ∩ B) = P(A) x P(B)

#### 概率分布（Probability distributions）
* P为概率测量，X为随机变量，则函数`F(x) = P(X ≤ x)（x ∈ R）`称为X的概率分布函数
* 离散分布
  - 均匀分布：其中有限个数值拥有相同的概率
  - 二项分布：计算概率的前提是每次抽出样品后再放回去，并且只能有两种试验结果
    <div style="width:300px">
    {% asset_img 二项分布.png%}
    </div>
  - 正态分布（normal distribution）：
    - N(μ,σ)：μ是平均数，σ是标准差
  - 近似正态分布
    - 平均数为：np
    - 标准差为：√(np(1 - p)).
  - 标准偏差数（Z-scores)：Z =（x-μ）/σ
    - 68-95-99.7法则

## 统计学
### 变量
1. 将变量定义为：数字（numerical）和分类（categorical）
  <div style="width: 300px;">
  {% asset_img type_of_variables.png %}
  </div>
  * 对numerical进一步分类：连续的（continuous）和 离散的（discrete）
  <div style="width: 300px;">
  {% asset_img type_of_variables_numerical.png %}
  </div>
  * 对categorical进一步分类：有序的（ordinal）和无序的（regular categorical）
    - regular categorical（例如：morning person 、afternoon person）
    - ordinal: 例如：满意度调查里的选项（非常不满意，不满意，一般，满意，非常满意））
2. 关联变量（associated variables）: 说明两个变量之间的关系的变量，分为正关联和负关联
3. 独立变量（自变量）：没有关系的变量
4. 解释变量（explanatory variable)（因变量）：一对变量中会影响另一个变量的变量

### 实验（Experiments）和观察性研究（Observational Studies）
* 都是用来分析因果关系：从预估数据变化中得出结论，或者研究自变量与因变量之间的关系
* 用来确定并解释这个研究结果是否可以推广到人群，以及结果是否表明所研究的数量之间的相关性或因果关系
* 实验用来推断因果关系，观察性研究用来做相关陈述

#### 实验研究
1. 实现设计的四个原则
  * 控制任何可能的混杂因素
  * 将变量随机分配到治疗组（treatment groups）和参考组（control groups）
  * 使用足够大的样本或重复试验
  * 使用区组变量来减少干扰变量的影响
2. 作用：用于推断因果关系

### 样本
#### 抽样方法
1. 简单随机抽样（simple random sampling）：被抽中的概率是相同的
2. 系统抽样（systematic sampling）：也叫等距抽样，先从数字1到k之间随机抽取一个数字r作为初始单位，以后依次取r+k、r+2k……等单位
3. 分层抽样（stratified sampling）：先将相似的分类，从每个分类随机抽样
4. 集群抽样（cluster sampling）：先将数据分成相似的组（组内的数据是不相似），然后抽取几个组

#### 样本偏差
* 便利性样本偏差（Convenience sample bias）
* 无响应样本偏差（non-response bias）
* 自愿回应样本偏差（valuntary response bias）

### 单盲（Single Blinding）、双盲、安慰剂（Placebo）、安慰剂效应（Placebo effect）
1. 单盲：是一种简单实验方法，通过对试验对象保密，避免有意或无意在实验中造成偏颇
2. 双盲：双盲试验通常在试验对象为人类时使用，目的是避免试验的对象或进行试验的人员的主观偏向影响实验的结果，通常双盲试验得出的结果会更为严谨。
  * 在双盲试验中，受试验的对象及研究人员并不知道哪些对象属于对照组，哪些属于实验组，目的是避免研究结果受安慰剂效应或观察者偏向所影响

### 假设检验
* 零假设（null hypothesis）：零假设的内容一般是希望能证明为错误的假设，或者是需要着重考虑的假设。
* 备择假设（alternative hypothesis）：也叫对立假设，即希望证明是正确的另一种可能
* 两种基本误差：
<div style="width: 400px;">
{% asset_img 第一型和第二型错误.png %}
</div>
* 步骤：
  1. 最初研究假设为真相不明
  2. 第一步是提出相关的零假设和备择假设
  3. 第二步是考虑检验中对样本做出的统计假设；
  4. 决定那个检验是合格的，并确定相关检验统计量 T。
  5. 在零假设下推到检验统计量的分布。（如：检验统计量会符合正态分布）
  6. 选择一个显著性水平（α），若低于这个概率阈值，就会拒绝零假设
  7. 根据零假设成立时的检验统计量T分布，找到数值最接近的备择假设，且机率为显著水平（α）的区域，此区域为“拒绝域”，意思是在零假设成立的前提下，落在拒绝域的机率只有α
  8. 针对检验统计量T，根据样本计算其估计值t
  9. 若估计值t未落在“拒绝域”，接受零假设。若估计值t落在“拒绝域”，拒绝零假设，接受备择假设

### Random Sample and Random Assignment
1. 区别
  * Random Sample：occur when subjects are being selected for a study
  * Random Assignment：occur only in experimental setting
2. 使用和不使用Random Sample/Random Assignment
  <div style="width: 300px;">
  {% asset_img random_simple.png %}
  </div>

### 描述数值分布
#### 术语
* shape、center、spread、any unusual observations
  * center： 平均数（mean）、中位数（median）、模式（mode）
  * spread：标准差（standard deviation）、范围（range）、四分位数范围（interquartile range）
    - 范围（range）：（range=max-min）
    - 方差（variance）：S^2 = (（x1-x)^2 + (x2-x)^2 + ... )/(n-1)，衡量一组数据离散程度的度量
    - 标准差（standard deviation）：S
    - 四分位距（interquartile range:IQR） IQR=Q3-Q1，表示统计资料中各变量分散情形
  * shape：对称（symmetric）、右偏移（right skewed）、左偏移（left skewed）、单峰（unimodal）、双峰（bimodal）、多峰（multimodal）、均匀（uniform）
  *

#### 统计图表
* 用来表示数字的图表
  1. 散点图（scatter plots）：x轴（explanatory variable）、y轴（response variable）
  2. 直方图（histogram）
    * 用于展示数据密度（data density）
    * 通过直方图识别分布的形状（shape）
    * 直方图需要使用合适的宽度（bin width）
  3. 箱形图（box plots）
    * 是一种用作显示一组数据分散情况资料的统计图
    * 它能显示出一组数据的最大值、最小值、中位数、及上下四分位数。
* 用来表示分类的图表
  1. 表示single Categorical variable
    - 频率表（frequency table）、 条形图（bar plot）
  2. 表示relationship of categorical Data
    - contingency table、分段条形图（segmented bar plots)、马赛克图（mosaic plots）
  3. 表示relationship of numerical and categorical data：side-by-side box plots
