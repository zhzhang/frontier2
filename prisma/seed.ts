import { Auth0Provider } from "use-auth0-hooks";
import prisma from "../lib/prisma";
import { RoleEnum } from "../lib/types";

async function main() {
  const user = await prisma.user.create({
    data: {
      id: "DO66T35YeDSS15NQga5XYOeGqyg2",
      email: "jordan@frontier.pub",
      name: "Jordan Zhang",
    },
  });
  const reviewer = await prisma.user.create({
    data: {
      id: "DO66T35YeDSS15NQga5XYOeGqyg4",
      email: "john.doe@frontier.pub",
      name: "John Doe",
    },
  });
  const organization = await prisma.organization.create({
    data: {
      id: "cklhou5t30000wpfwuehicxyu",
      name: "Association for Computational Linguistics",
      abbreviation: "ACL",
      description: `<p><span style="color: rgb(51, 51, 51);">The&nbsp;</span><strong style="color: rgb(51, 51, 51);">Association for Computational Linguistics&nbsp;(ACL) </strong><span style="color: rgb(51, 51, 51);">is the premier international scientific and professional society for people working on computational problems involving human language, a field often referred to as either computational linguistics or natural language processing (NLP). The association was founded in 1962, originally named the&nbsp;Association for Machine Translation and Computational Linguistics&nbsp;(AMTCL), and became the ACL in 1968. Activities of the ACL include the holding of an annual meeting each summer and the sponsoring of the journal&nbsp;</span><em style="color: rgb(51, 51, 51);">Computational Linguistics,&nbsp;</em><span style="color: rgb(51, 51, 51);">published by MIT Press; this conference and journal are the leading publications of the field. For more information, see:&nbsp;</span><a href="https://www.aclweb.org/" rel="noopener noreferrer" target="_blank" style="color: rgb(204, 0, 0); background-color: rgb(255, 255, 255);">https://www.aclweb.org/</a><span style="color: rgb(51, 51, 51);">.&nbsp;</span></p>`,
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
    },
  });
  const otherOrganization = await prisma.organization.create({
    data: {
      name: "International Conference on Learning Representations",
      abbreviation: "ICLR",
      description: `<p><span style="color: rgb(51, 51, 51);">The International Conference on Learning Representations (ICLR) is the premier gathering of professionals dedicated to the advancement of the branch of artificial intelligence called representation learning, but generally referred to as deep learning.

ICLR is globally renowned for presenting and publishing cutting-edge research on all aspects of deep learning used in the fields of artificial intelligence, statistics and data science, as well as important application areas such as machine vision, computational biology, speech recognition, text understanding, gaming, and robotics.

Participants at ICLR span a wide range of backgrounds, from academic and industrial researchers, to entrepreneurs and engineers, to graduate students and postdocs.</span></p>`,
      logoRef: "logos/Mt1ozX07_400x400.jpg",
    },
  });
  await prisma.organizationMembership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: RoleEnum.ADMIN,
    },
  });
  const abstract =
    "<p>Automatic hypernymy detection is a crucial task in machine understand of natural languages, with applications in information extraction and question answering. Much of the work in unsupervised hypernymy detection revolves around the distributional semantic model (DSM) framework, in particular the representation of words as vectors in Vector Space Models (VSMs). Based on the hypothesis that hypernyms should be able to substitute for their hyponyms in most natural context, researchers have devised various asymmetric measures which quantify the overlap of context features as indicators of hypernymy. However, most VSMs make the strong assumption that individual context features occur independently of each other, which can lead to nonsensical results in hypernymy detection when the various contexts in which a word may found in a corpus are conflated. The proposed solution is to use density matrices, which make no independence assumptions about the context feature direction and can thus represent encode information about the original sentences in a corpus. In this thesis we present the first full-scale implementations of quantum density matrices as a distributional semantic model. We apply the density matrix model to the hypernymy detection problem and implement several quantum versions of previous asymmetric measures, many of which are novel adaptations. We show that density matrices perform reasonably well on three tasks in hypernymy detection, despite the simplicity of our context models, achieving an accuracy of 57.2% in the hypernymy direction task, and a precision of 61.9% in the hypernymy precision task using random noun pairs. Furthermore, we prove through a qualitative analysis that density matrices can indeed encode disparate word usages where VSMs cannot</p>";
  const ref = "articles/7fcb70aa-af7e-4c45-9bce-e194c8dc8329.pdf";
  const article = await prisma.article.create({
    data: {
      id: "cklgwx4zu000058v2vz52cajm",
      title: "Density Matrices for Lexical Entailment",
      authors: {
        connect: [{ id: user.id }],
      },
      versions: {
        create: [
          {
            abstract: abstract,
            ref: ref,
            versionNumber: 1,
          },
          {
            abstract: abstract,
            ref: ref,
            versionNumber: 2,
          },
        ],
      },
      anonymous: false,
    },
  });

  const reviewBody = `<h2>Features:</h2><ul><li>Full text editor built on Quill.js</li><li class="ql-indent-1">Headers</li><li class="ql-indent-1">Lists</li><li class="ql-indent-1"><strong>Bold</strong> <em>Italic</em> <s>Strikethrough</s></li><li class="ql-indent-1">Formulas <span class="ql-formula" data-value="f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^{2}}">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mfrac><mn>1</mn><mrow><mi>σ</mi><msqrt><mrow><mn>2</mn><mi>π</mi></mrow></msqrt></mrow></mfrac><msup><mi>e</mi><mrow><mo>−</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mo stretchy="false">(</mo><mfrac><mrow><mi>x</mi><mo>−</mo><mi>μ</mi></mrow><mi>σ</mi></mfrac><msup><mo stretchy="false">)</mo><mn>2</mn></msup></mrow></msup></mrow><annotation encoding="application/x-tex">f(x)=\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^{2}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal" style="margin-right: 0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right: 0.277778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.277778em;"></span></span><span class="base"><span class="strut" style="height: 1.52492em; vertical-align: -0.538em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.845108em;"><span class="" style="top: -2.55101em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right: 0.03588em;">σ</span><span class="mord sqrt mtight"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.912845em;"><span class="svg-align" style="top: -3em;"><span class="pstrut" style="height: 3em;"></span><span class="mord mtight" style="padding-left: 0.833em;"><span class="mord mtight">2</span><span class="mord mathnormal mtight" style="margin-right: 0.03588em;">π</span></span></span><span class="" style="top: -2.87284em;"><span class="pstrut" style="height: 3em;"></span><span class="hide-tail mtight" style="min-width: 0.853em; height: 1.08em;"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.127155em;"><span class=""></span></span></span></span></span></span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.394em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.538em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.98692em;"><span class="" style="top: -3.363em; margin-right: 0.05em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mtight"><span class="mopen nulldelimiter sizing reset-size3 size6"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.844314em;"><span class="" style="top: -2.656em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span class="" style="top: -3.2255em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line mtight" style="border-bottom-width: 0.049em;"></span></span><span class="" style="top: -3.384em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.344em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter sizing reset-size3 size6"></span></span><span class="mopen mtight">(</span><span class="mord mtight"><span class="mopen nulldelimiter sizing reset-size3 size6"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.87905em;"><span class="" style="top: -2.656em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right: 0.03588em;">σ</span></span></span></span><span class="" style="top: -3.2255em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line mtight" style="border-bottom-width: 0.049em;"></span></span><span class="" style="top: -3.46239em;"><span class="pstrut" style="height: 3em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">x</span><span class="mbin mtight">−</span><span class="mord mathnormal mtight">μ</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.344em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter sizing reset-size3 size6"></span></span><span class="mclose mtight"><span class="mclose mtight">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.891314em;"><span class="" style="top: -2.931em; margin-right: 0.0714286em;"><span class="pstrut" style="height: 2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>﻿</span> </li><li>Reviews can be viewed alongside article.</li></ul>`;

  const review1 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 1,
      articleId: article.id,
      published: true,
      organizationId: organization.id,
      rating: 1,
      canAccess: false,
      body: "",
    },
  });
  const review2 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 2,
      articleId: article.id,
      published: true,
      organizationId: otherOrganization.id,
      body: reviewBody,
      rating: 3,
    },
  });
  await prisma.threadMessage.create({
    data: {
      reviewId: review2.id,
      userId: user.id,
      body: `<p><span style="color: rgb(51, 51, 51Y);">Author rebuttals and other discussion on public reviews can be viewed in a thread below the review.</span></p>`,
    },
  });

  const metaReview = await prisma.metaReview.create({
    data: {
      authorId: reviewer.id,
      body: `<p><span style="color: rgb(51, 51, 51Y);">This is an example meta-review. Reviews that a author cites in writing the meta-review are attached to the meta-review. Reviews from other organizations can be cited as well!</span></p>`,
      decision: true,
      articleId: article.id,
      organizationId: organization.id,
    },
  });
  await prisma.metaReview.update({
    where: { id: metaReview.id },
    data: {
      citedReviews: {
        connect: [{ id: review1.id }, { id: review2.id }],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
