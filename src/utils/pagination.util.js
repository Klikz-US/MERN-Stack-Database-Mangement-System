import React, { Component } from "react";
import { Pagination } from "react-bootstrap";
import {
    createUltimatePagination,
    ITEM_TYPES,
} from "react-ultimate-pagination";
import PropTypes from "prop-types";

const PaginationInternal = createUltimatePagination({
    WrapperComponent: Pagination,
    itemTypeToComponent: {
        [ITEM_TYPES.PAGE]: ({ value, isActive }) => (
            <Pagination.Item data-value={value} active={isActive}>
                {value}
            </Pagination.Item>
        ),
        [ITEM_TYPES.ELLIPSIS]: ({ value, isActive, onClick }) => (
            <Pagination.Ellipsis data-value={value} onClick={onClick} />
        ),
        [ITEM_TYPES.FIRST_PAGE_LINK]: ({ isActive, onClick }) => (
            <Pagination.First
                data-value={1}
                disabled={isActive}
                onClick={onClick}
            />
        ),
        [ITEM_TYPES.PREVIOUS_PAGE_LINK]: ({ value, isActive, onClick }) => (
            <Pagination.Prev
                data-value={value}
                disabled={isActive}
                onClick={onClick}
            />
        ),
        [ITEM_TYPES.NEXT_PAGE_LINK]: ({ value, isActive, onClick }) => (
            <Pagination.Next
                data-value={value}
                disabled={isActive}
                onClick={onClick}
            />
        ),
        [ITEM_TYPES.LAST_PAGE_LINK]: ({ value, isActive, onClick }) => (
            <Pagination.Last
                data-value={value}
                disabled={isActive}
                onClick={onClick}
            />
        ),
    },
});

export default class AppPagination extends Component {
    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        const a = event.target;

        if (a.nodeName === "SPAN" || a.dataset.value !== undefined) {
            const pageNumber = a.dataset.value
                ? parseInt(a.dataset.value, 10)
                : parseInt(a.parentNode.dataset.value, 10);

            if (typeof this.props.onChange === "function") {
                this.props.onChange(pageNumber);
            }
        }
    }

    render() {
        const { currentPage, totalPages } = this.props;

        return (
            <PaginationInternal
                className="float-right mb-0 mt-2 border border-info shadow p-1"
                currentPage={currentPage}
                totalPages={totalPages}
                onClick={this.onClick}
            />
        );
    }
}
