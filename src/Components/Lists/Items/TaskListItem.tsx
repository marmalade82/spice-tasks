
import React from "react";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow, DateInput } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";

/**
 * When writing a large application, how do we write something that we have confidence works, even as large amounts of time pass,
 * and code is written and re-written? How do we have confidence that we didn't leave something out, or fail to check something?
 * 
 * Run-time checks:
 *      Have invariants that are checked every time you run that part of the program
 *      Have properties that are verified by tests
 *          Downside is that writing lots of tests is expensive without necessarily yielding a lot of value.
 *      Runtime typechecking - verify that data isn't getting corrupted. Try to do it as close to the source of the 
 *          data as possible to easily identify the source of the error. This is often Schema Validation, at least 
 *          in JavaScript.
 *      DSLs - Write in domain specific languages so that your code is more declarative, making the intent clearer.
 *       
 * 
 * Compile-time checks:
 *      Compile-time proofs -- it would be great to be able to prove that a run-time type check will always
 *          pass. But if this were possible, would a runt-time type check even be needed?
 *      Types verify that you are performing operations on the correct values.
 *      Types can also limit the size of the input domain -- the smaller the input domain you have, the 
 *          easier it is to verify correctness. That's what makes Ada's subtypes interesting -- you can choose to work
 *          with Natural Numbers instead of Integers. However, typecasts are sometimes necessary -- how do you handle when
 *          they fail? You could fall back to a default value, but that may contravene user intent and lead to an 
 *          unexpected result, which may not be acceptable. You could report an error, but that may leave the program in
 *          an invalid state where the user can no longer move forward -- then you just have to tell them to contact an 
 *          admin who can investigate the error. You could crash the program. 
 *          Or, you could force restart of the user experience (like Windows does), 
 *          which hopefully restores the user experience (much easier if startup validates everything to have the correct types).
 *          Which one you choose is up to you.
 *      Abstract data types (ADTs) - control the input that people can feed your module by abstracting the underlying representation
 *          This means that if your module works, users *must* use it correctly, since they only have the inputs
 *              you provided them.
 *      Usage analysis - annotate code with how it should be used, and enforce that usage by callers to ensure caller 
 *          correctness. State Machine descriptions, Resource descriptions.
 * 
 * Architecture checks:
 *      High cohesion (everything in same file) - easy to look for recurring usage patterns in same file and make sure everything 
 *          is refactored and optimal. Makes sure different logics aren't in the same file, so they can't easily be mixed when
 *          they shoudn't be (spaghetti code vs module with clear boundaries).
 *      Low coupling ( minimal types of calls between two different modules) - computational results of one module don't affect
 *          the correctness of other modules. As much as possible, we want correctness to be determined within the module itself.
 *          Thus, shared code is both beneficial (change in one spot fixes in all spots) and detrimental (high impact on 
 *          other modules logical correctness). This would appear to argue for all shared code to be in one file, even
 *          at the cost of cohesion (harder to see patterns when different logic areas are in the same file)
 *      Error at module boundaries (allow call to separate module to return an Error monad) - reduces reliance on
 *          another module, since it might fail -- introducing possibility of error increases robustness of the caller 
 *          implementation. Also prevents exceptions from propagating to unrelated modules.
 *      Indirection at module boundaries (request a result via arguments instead of choosing an implementation directly) - 
 *          Allows the called module to determine what the correct result is. Means that the called module ultimately
 *              controls what happens, like in a client-server relationship. This is a good way to put the responsibility
 *              for logic in the correct place, which contributes to low coupling and high cohesion.
 *      Work with interfaces (Partial Abstract Data Types) instead of concrete implementations (similar to above). Enforces an architecture with 
 *          dependency injection (caller determines implementation) or Abstract Data Types that may have lower coupling.
 *          However, dependency injection often makes code harder to understand, since the code reader doesn't know what 
 *          implementation is being used at runtime -- perhaps that needs to be a runtime tag?
 *      Ordering a Product (Sane Assembly Lines, Determinism) - As much as possible, we want our code to generate results
 *          in a pipeline -- there should be as little branching as possible, and if there is branching, it should all exist in
 *          one place so that the different possible pipeline branches are clear. This way, non-determinism is restricted
 *          to the start, and everything that happens is easy to understand (sight-determinism). This makes it easier to
 *          determine where something is incorrect. This plays into the idea of modes -- it is often the case that each
 *          function needs to act differently depending on a set of conditions. If you can formalize the conditions,
 *          check them once, and use them across all of an object's methods -- then you have essentially created
 *          sight-determinism. This bears a striking resemblance to State Machines, in that once we know what State we're 
 *          in, we know exactly what to do, and how to respond to input.
 *      Simplifying logic (one pipeline, pushing branching as late as possible)
 *          However, it's also true that the earlier you determine a Mode, the sooner you make that Mode the responsibility
 *              of all downstream code, whether or not it requires it. And earlier branches multiply against further branches
 *              downstream, increasing the total complexity of the code. So there's actually a case to be made for pushing
 *              branching *downstream* when possible. Spreading pipelines across multiple object methods is also 
 *              not a good sign, since this breaks up what was intended to be sequential logic, making it impossible
 *              to understand a pipeline at a glance, and disconnecting the upstream pipeline from the downstream
 *              pipeline. It would be better to write one (or several) pipeline methods that can pause and continue
 *              based on other methods, much like how user input pauses and contineus the user experience. One pipeline with 
 *              no branches, for as long as possible, is best.
 *      Separation of Concerns/Responsibilities - What is this important? What does it really mean? I never used to understand that,
 *          but with my current code I'm beginning to see a bit. TODO : 
 *      Code that has clear intent (clear modes, clear CONTEXTS). You might think that a context is solely dependent on
 *          the external state code is operating in, but that isn't true. The meaning of that external state (which may live in 
 *          a database) may also depend on a situational context from the user (the true variable).
 * 
 * All of these make it easier to say that logic in the module you're changing is not responsible for the correctness of 
 * another module -- it's responsible all on its own for being correct.
 */


interface Props {
    item: Task
    accessibilityLabel: string
    navigation: Navigation<ScreenParams>
    onTaskAction: OnTaskAction
    iconIndicates?: "completion"
}

export type OnTaskAction = (id: string, action: "complete" | "fail") => void;

interface State {
    showMore: boolean;
}

interface Task {
    id: string;
    title: string;
    due_date: Date;
    start_date: Date;
    active: boolean;
    time: Date;
    state: "open" | "in_progress" | "complete" | "cancelled"
    willRepeat: boolean;
}

export default class TaskListItem extends Item<Props, State, Task> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const { id, title, due_date, start_date, active, time } = this.props.item;

        return (
            <ListItem
                text={title}
                subtext_2={`${new MyDate(time).format("h:mm A")}`}
                subtext={`${new MyDate(start_date).format("MMM Do")}`}
                navigation={this.props.navigation}
                destination={'Task'}
                params={{id: id}}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
                type={this.type()}
                color={this.color()}
                size={this.size()}
                footerIcons={[
                    () => {
                        return (
                            <ModalIconButton
                                type={"more"}
                                data={{
                                    showModal: this.state.showMore,
                                }}
                                onDataChange={({showModal}) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Mark complete"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onTaskAction(id, "complete");
                                    }}
                                    accessibilityLabel={"complete-" + id}
                                ></ModalRow>
                                <ModalRow
                                    text={"Mark failed"}
                                    iconType={"fail"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onTaskAction(id, "fail");
                                    }}
                                    accessibilityLabel={"fail-" + id}
                                ></ModalRow>
                            </ModalIconButton>
                        )
                    }
                ]}
            >

            </ListItem>
        )
    }

    private iconOpts = () => {
        const { Class, Common, Custom } = this.context;
        const { id, title, due_date, start_date, active, state } = this.props.item;
        if(this.props.iconIndicates === "completion") {
            if(active) {
                if(state === "open" || state === "in_progress") {
                    return {
                        type: "none",
                        color: "transparent",
                        size: 30,
                    }  as const;
                }
            } else {
                if(state === "complete") {
                    return {
                        type: "complete",
                        ...Custom.ListItem_Icon2
                    } as const;
                } else if (state === "cancelled") {
                    return {
                        type: "not-complete",
                        ...Custom.ListItem_Icon
                    } as const;
                }
            }
        }
        return {
            type: this.props.item.willRepeat ? "recur" : "task",
            ...Custom.ListItem_Icon2
        } as const;

    }

    private type = () => {
        return this.iconOpts().type
    }

    private color = () => {
        return this.iconOpts().color
    }

    private size = () => {
        return this.iconOpts().size
    }
}

export {
    TaskListItem,
    Task,
}