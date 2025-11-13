import Head from "next/head";

export default function Page() {
  const headHtml = `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="description" content="HTTrack is an easy-to-use website mirror utility..." />
  <title>Local index - HTTrack Website Copier</title>`;

  const bodyHtml = `<h1 align="center">Index of locally available sites:</h1>
  <table border="0" width="100%" cellspacing="1" cellpadding="0">
    <tr>
      <td background="fade.gif">
        &middot;
        <a href="html.merku.love/hosteller/index04b9.html">Home | Hosteller</a>
      </td>
    </tr>
  </table>
  <meta http-equiv="Refresh" content="0; URL=html.merku.love/hosteller/index04b9.html">`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <div dangerouslySetInnerHTML={{ __html: headHtml }} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
