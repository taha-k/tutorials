/**
 * Created by taha on 9/10/17.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import * as courseActions from '../../actions/courseActions';
import CourseForm from "./CourseForm";

class ManageCoursePage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {}
    };

    _.bindAll(this, 'updateCourseState', 'saveCourse');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.course.id !== nextProps.course.id) {
      // Necessary to populate form when existing
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = this.state.course;
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  saveCourse(event) {
    event.preventDefault();
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect());
  }

  redirect() {
    this.context.router.push('/courses');
  }

  render() {
    return (
      <CourseForm
        allAuthors={this.props.authors}
        course={this.state.course}
        errors={this.state.errors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function getCourseById(courses, id) {
  const course = courses.filter(course => course.id === id);
  if(course.length) return course[0];
  return null;
}

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id; // from the path `/course/:id`
  let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};

  if (courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }
  const authorsFormattedForDropdown = state.authors.map(author => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    };
  });

  return {
    course: course,
    authors: authorsFormattedForDropdown
  };
}

// Pull in the React Router context so router is available on this.context.router
ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
