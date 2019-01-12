import { withRouter } from 'next/router';
import { Component } from 'react';
import PropTypes from 'prop-types';
import matter from 'gray-matter';
import getReadingTime from 'reading-time';
import remark from 'remark';
import remarkReact from 'remark-react';
import MetaInfo from '../components/MetaInfo';
import Content from '../components/Content';
import { gistPlugin, remarkReactConfig } from '../lib';
import SocialShare from '../components/SocialShare';
import css from './post.module.css';

class Post extends Component {
  static propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    day: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    readingTime: PropTypes.string.isRequired
  };

  static async getInitialProps(context) {
    const { id, year, month, day } = context.query;
    const post = await import(`../_posts/${year}-${month}-${day}-${id}.md`);
    const document = matter(post.default);

    return {
      slug: id,
      year,
      month,
      day,
      content: document.content,
      readingTime: getReadingTime(document.content),
      title: document.data.title
    };
  }

  render() {
    const { content, title, year, month, day, readingTime, slug } = this.props;
    const url = `https://magarcia.github.io/${year}/${month}/${day}/${slug}`;
    return (
      <>
        <article className={css.article}>
          <h1 className={css.title}>{title}</h1>
          <MetaInfo {...{ year, month, day, readingTime }} />
          <Content>
            {
              remark()
                .use(gistPlugin)
                .use(remarkReact, remarkReactConfig)
                .processSync(content).contents
            }
          </Content>
        </article>
        <SocialShare title={title} url={url} />
      </>
    );
  }
}

export default withRouter(Post);
