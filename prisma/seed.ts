import { Auth0Provider } from "use-auth0-hooks";
import prisma from "../lib/prisma";
import { RoleEnum } from "../lib/types";
import cuid from "cuid";

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

  // Andrew Caines
  const andrew = await prisma.user.create({
    data: {
      id: cuid(),
      email: "andrew.caines@cl.cam.ac.uk",
      name: "Andrew Caines",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hjc68@cl.cam.ac.uk",
      name: "Hannah Craighead",
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "paula.buttery@cl.cam.ac.uk",
      name: "Paula Buttery",
    },
  });
  const user4 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hellen.yannakoudakis@cl.cam.ac.uk",
      name: "Helen Yannakoudakis",
    },
  });

  // ORGANIZATION
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
    "<p>We address the task of automatically grading the language proficiency of spontaneous speech based on textual features from automatic speech recognition transcripts. Motivated by recent advances in multi-task learning, we develop neural networks trained in a multi-task fashion that learn to predict the proficiency level of non-native English speakers by taking advantage of inductive transfer between the main task (grading) and auxiliary prediction tasks: morpho-syntactic labeling, language modeling, and native language identification (L1). We encode the transcriptions with both bi-directional recurrent neural networks and with bi-directional representations from transformers, compare against a feature-rich baseline, and analyse performance at different proficiency levels and with transcriptions of varying error rates. Our best performance comes from a transformer encoder with L1 prediction as an auxiliary task. We discuss areas for improvement and potential applications for text-only speech scoring.</p>";
  const article = await prisma.article.create({
    data: {
      id: "cklgwx4zu000058v2vz52cajm",
      title:
        "Investigating the Effect of Auxiliary Objectives for the Automated Grading of Learner English Speech Transcriptions",
      authors: {
        create: [
          { authorNumber: 1, user: { connect: { id: user2.id } } },
          { authorNumber: 2, user: { connect: { id: andrew.id } } },
          { authorNumber: 3, user: { connect: { id: user3.id } } },
          { authorNumber: 4, user: { connect: { id: user4.id } } },
        ],
      },
      versions: {
        create: [
          {
            abstract: abstract,
            ref: "articles/ACL2020_SpeechScoring.pdf",
            versionNumber: 1,
            createdAt: "2020-01-06T12:00:00.000Z",
          },
          {
            abstract: abstract,
            ref: "articles/ACL2020_SpeechScoring_camera_ready.pdf",
            versionNumber: 2,
            createdAt: "2020-06-11T12:00:00.000Z",
          },
        ],
      },
      anonymous: false,
    },
  });

  const tmp = prisma.articleAuthor.create({
    data: {
      user: { connect: { id: user2.id } },
      article: { connect: { id: article.id } },
      authorNumber: 1,
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
      userId: andrew.id,
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
